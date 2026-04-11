/** Compute column layout for overlapping scheduled tasks */
export function computeColumns(tasks) {
  const sorted = [...tasks].sort((a, b) => a.slot - b.slot);
  const cols = [];
  const taskCol = {};

  sorted.forEach(task => {
    let placed = false;
    for (let c = 0; c < cols.length; c++) {
      const last = cols[c][cols[c].length - 1];
      if (last.slot + last.duration <= task.slot) {
        cols[c].push(task);
        taskCol[task.id] = c;
        placed = true;
        break;
      }
    }
    if (!placed) {
      taskCol[task.id] = cols.length;
      cols.push([task]);
    }
  });

  const result = {};
  sorted.forEach(task => {
    const active = new Set([taskCol[task.id]]);
    sorted.forEach(other => {
      if (other.id !== task.id &&
          other.slot < task.slot + task.duration &&
          other.slot + other.duration > task.slot) {
        active.add(taskCol[other.id]);
      }
    });
    result[task.id] = { col: taskCol[task.id], total: active.size };
  });

  return result;
}
