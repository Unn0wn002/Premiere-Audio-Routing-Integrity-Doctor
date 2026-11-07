"""Read saved native project structure; never edits or drives Premiere."""
from pathlib import Path
import argparse, collections, datetime, gzip, hashlib, json, xml.etree.ElementTree as ET

parser = argparse.ArgumentParser()
parser.add_argument('--expected-clips', type=int, required=True)
parser.add_argument('--stage', required=True)
args = parser.parse_args()
run = Path(__file__).resolve().parent
files = list((run / 'working').glob('*.prproj'))
assert len(files) == 1, 'Expected one isolated native project'
project = files[0]
data = project.read_bytes()
root = ET.fromstring(gzip.decompress(data))
objects = {element.attrib['ObjectID']: element for element in root if 'ObjectID' in element.attrib}
tracks = []
for track in root.findall('AudioClipTrack'):
    refs = track.findall('./ClipTrack/ClipItems/TrackItems/TrackItem')
    items = []
    for ref in refs:
        item = objects[ref.attrib['ObjectRef']]
        assert item.tag == 'AudioClipTrackItem'
        start = int(item.findtext('./ClipTrackItem/TrackItem/Start', '0'))
        end = int(item.findtext('./ClipTrackItem/TrackItem/End'))
        assert end > start
        items.append({'objectId': ref.attrib['ObjectRef'], 'startTicks': start, 'endTicks': end})
    items.sort(key=lambda i: i['startTicks'])
    for previous, current in zip(items, items[1:]):
        assert previous['endTicks'] == current['startTicks'], 'Noncontiguous or overlapping repeated media'
    tracks.append({'id': track.attrib.get('ObjectUID'), 'clips': items})
count = sum(len(track['clips']) for track in tracks)
assert count == args.expected_clips, f'Expected {args.expected_clips}, saved referenced clips={count}'
if count:
    assert len(root.findall('Sequence')) == 1
    assert sum(bool(track['clips']) for track in tracks) == 1
    lengths = {clip['endTicks'] - clip['startTicks'] for track in tracks for clip in track['clips']}
    assert len(lengths) == 1, 'Unexpected repeated-clip length difference'
    assert min(clip['startTicks'] for track in tracks for clip in track['clips']) == 0
record = {
    'verifiedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'evidenceClass': 'SAVED_NATIVE_PROJECT_STRUCTURE_NOT_UI_OR_SCAN_PROOF',
    'project': str(project.relative_to(run)).replace('\\', '/'),
    'projectSha256': hashlib.sha256(data).hexdigest(),
    'sequenceCount': len(root.findall('Sequence')),
    'audioTrackCount': len(tracks),
    'populatedAudioTracks': sum(bool(track['clips']) for track in tracks),
    'referencedAudioClipOccurrences': count,
    'rootAudioClipTrackItemObjects': len(root.findall('AudioClipTrackItem')),
    'contiguousRepeatedClipRanges': True,
    'tracks': tracks,
    'sourcePaths': sorted({element.text for element in root.iter() if element.tag in ['FilePath', 'ActualMediaFilePath'] and element.text}),
    'limitations': ['Saved structure is distinct from UI responsiveness and native adapter reads.', 'No routing, mapping, acoustic or customer-performance qualification.']
}
out = run / f'stage-{args.stage}-structure.json'
assert not out.exists(), 'Preserve prior stage evidence'
snapshot = run / 'baseline' / f'stage-{args.stage}.prproj'
assert not snapshot.exists()
snapshot.write_bytes(data)
out.write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
print(json.dumps({key: record[key] for key in ['projectSha256', 'sequenceCount', 'audioTrackCount', 'populatedAudioTracks', 'referencedAudioClipOccurrences', 'contiguousRepeatedClipRanges']}, indent=2))
