export function renderTableAsMD(metric_result, metric_name, aggregation_name) {
  let table = `| Pipeline | ${metric_name}(${aggregation_name}) |
|---|---|`;
  for (const pipeline of metric_result) {
    table += `| ${pipeline.name} | ${pipeline.data}|\n`
  }
  return table
}
