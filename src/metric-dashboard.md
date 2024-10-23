---
theme: dashboard
title: Benchmark dashboard
toc: false
---

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

${experiment.Description}


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
        const descriptions = [...results].map((e) => Object.keys(e)[0]);
        descriptions.forEach((e) => accumulator.add(e));
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
    sum: (arr) => arr.reduce((a,b) => a+b, 0),
    sum_fraction: arr => arr.reduce((a,b) => a+b, 0)/arr.length,
}
```

```js
const chosen_aggregation = view(Inputs.select(Object.keys(aggregations)))
```

```js
const metric_data = experiment.Results.reduce(
    (acc, pipeline) => {
        const modelName = Object.keys(pipeline)[0];
        const results = Object.values(pipeline[modelName]["results"]);
        const metric_result = results.map((e) => e[plot_metric]);
        acc.push({name: modelName, data: aggregations[chosen_aggregation](metric_result)});
        return acc;
    }, []
)
```

```js
Plot.barY(metric_data, {x: "name", y: "data"}).plot()
```
