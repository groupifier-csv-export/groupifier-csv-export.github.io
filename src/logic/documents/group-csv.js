import { parseActivityCode, activityById } from '../activities';

const roles = [
  { id: 'competitor', label: '' },
  { id: 'staff-scrambler', label: 'S' },
  { id: 'staff-runner', label: 'R' },
  { id: 'staff-judge', label: 'J' },
];

//https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
const download = (filename, text) => {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const downloadGroupCsv = (wcif, rounds) => {
  const events = rounds.map(round => round.id.split('-')[0]);
  var csv =
    'Name,WCA_ID,' +
    events.map(event => 'G' + event + ',H' + event + ',').join('') +
    '\n' +
    wcif.persons
      .map(person => lineForCompetitor(person, events, wcif))
      .join('\n');
  // var outputFile = new File('groups.csv');
  // outputFile.writeln('Groups.csv', csv, (err) => {});
  // outputFile.close();
  download('groups.csv', csv);
};

const lineForCompetitor = (competitor, events, wcif) => {
  var line = competitor.name + ',' + competitor.wcaId + ',';

  var actsByType = roles
    .map(role => role.id)
    .map(role =>
      competitor.assignments
        .filter(assignment => assignment.assignmentCode === role)
        .map(assignment =>
          parseActivityCode(
            activityById(wcif, assignment.activityId).activityCode
          )
        )
    );

  var competingGroup = actsByType.shift();

  events.forEach(event => {
    var compGroupEvent = competingGroup.filter(act => act.eventId === event);

    if (compGroupEvent.length > 0) {
      line += compGroupEvent.map(act => act.groupNumber) + ',';

      var strHelpingAssignments = actsByType
        .map((acts, index) => {
          return acts.map(act =>
            act.eventId === event
              ? String(roles[index + 1].label) + String(act.groupNumber)
              : null
          );
        })
        .flat()
        .filter(e => e != null);

      line += strHelpingAssignments.join(' ') + ',';
    } else {
      line += ',,';
    }
  });
  return line;
};
