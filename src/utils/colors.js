/** Get the task colour object from a task and theme */
export function getTaskColor(task, deadlines, theme) {
  if (task.deadlineId) {
    const dl = deadlines.find(d => d.id === task.deadlineId);
    if (dl) return theme.deadline[dl.colorIdx % theme.deadline.length];
  }
  if (task.colorId) {
    const tc = theme.taskColor.find(c => c.id === task.colorId);
    if (tc) return tc;
  }
  return theme.taskColor[0]; // default white
}
