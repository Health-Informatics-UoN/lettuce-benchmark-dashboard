---
theme: dashboard
title: Benchmark dashboard
toc: false
---

```js
import { saveSvgAsFile } from "./components/savefig.js"
import { renderTableAsMD } from "./components/renderTable.js"
```
# Explore your Benchmark results

```js
const file = view(Inputs.file({label: "Benchmark output", accept: ".json", required: true}));
```

```js
function timeConvert(timestamp){
    const d = new Date(timestamp * 1000)
    return d
}
```

```js
const benchmark_data = file.json();
```

```js
const experiment = view(
    Inputs.select(
        benchmark_data,
        {
            label: "Select experiment",
            format: (e) => `${e.Experiment} (${timeConvert(e.Time)})`,
        }
    )
)
```

## ${experiment.Experiment}

```js
experiment.Description
```

```js
const experiment_metrics = experiment.Results.reduce(
    (accumulator, pipeline) => {
        const modelName = Object.keys(pipeline)[0];
        const descriptions = pipeline[modelName].metric_descriptions;
        descriptions.forEach((e) => accumulator.add(e));
        return accumulator;
    },
    new Set()
);
```

```js
view(Inputs.table([...experiment_metrics].map((e) => [e]), {header: ["Metric"]}))
```

```js
const results_table = experiment.Results.map(pipeline => {
    const modelName = Object.keys(pipeline)[0];
    const metrics = Object.keys(pipeline[modelName].results[0]);     
    const row = { name: modelName };
    
    metrics.forEach(metric => {
        row[metric] = true;
    });
    
    return row;
});
```

```js
view(Inputs.table(results_table))
```

### Plot

```js
const short_metrics = experiment.Results.reduce(
    (accumulator, pipeline) => {
        const modelName = Object.keys(pipeline)[0];
        const results = Object.values(pipeline[modelName]["results"]);
        const descriptions = [...results].map((e) => Object.keys(e));
        descriptions.forEach((e) => {
                e.forEach((d) => accumulator.add(d))
            }
        );
        return accumulator;
    },
    new Set()
);
```

```js
const plot_metric = view(Inputs.select(short_metrics))
```

```js
const aggregations = {
    sum: arr => arr.reduce((a,b) => a+b, 0),
    mean: arr => arr.reduce((a,b) => a+b, 0)/arr.length,
    threshold: thresh => arr => arr.filter(b => b > thresh).length,
    fraction_threshold: thresh => arr => arr.filter(b => b > thresh).length/arr.length,
}
```

```js
const chosen_aggregation = view(Inputs.select(Object.keys(aggregations)))
```

```js
const threshold = chosen_aggregation=="threshold" || chosen_aggregation=="fraction_threshold" ? view(Inputs.text({type: "number", label: "Threshold value"})) : null
```

```js
const agg_func = threshold ? aggregations[chosen_aggregation](threshold) : aggregations[chosen_aggregation]
```

```js
const metric_data = experiment.Results.reduce(
    (acc, pipeline) => {
        const modelName = Object.keys(pipeline)[0];
        const results = Object.values(pipeline[modelName]["results"]);
        const metric_result = results.map((e) => e[plot_metric]);
        acc.push({name: modelName, data: agg_func(metric_result)});
        return acc;
    }, []
)
```

```js
const chart = Plot.plot({
    marginBottom: 80,
    x: {tickRotate: -30, label: "Pipeline"},
    y: {label: plot_metric + " (" + chosen_aggregation + ")" },
    marks: [
        Plot.ruleY([0]),
        Plot.barY(
            metric_data,
            {x: "name", y: "data", sort: {x: "y"}}
        )
    ]
});

const svgString = chart.outerHTML.replace(/^<svg /, '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" ');
```

<div class="grid grid-cols-2">
    <div class="card">${chart}</div>
    <div class="card">${view(Inputs.table(metric_data))}</div>
</div>

<div class="grid grid-cols-2">
    <div>${view(Inputs.button("Download chart", {value: null, reduce: () => saveSvgAsFile(svgString)}))}</div>
    <div>${view(Inputs.button("Copy table", {value:null, reduce: () => navigator.clipboard.writeText(renderTableAsMD(metric_data, plot_metric, chosen_aggregation))}))}</div>
</div>
