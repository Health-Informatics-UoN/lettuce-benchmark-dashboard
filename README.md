# Lettuce Benchmark Dashboard
[Lettuce](https://github.com/Health-Informatics-UoN/lettuce) is a tool for automatically generating mapping rules from source terms to [OMOP concepts](https://www.ohdsi.org/data-standardization/). As part of our efforts to make the tool configurable for different use cases, we have provided a framework for evaluating different models on mapping tasks. The output files from these evaluations can be interrogated programmatically. This app provides an interface to visualise these results.

## Using the app
Once you have some results from Lettuce's benchmarking scripts, upload your results file using the upload button at the top of the "Benchmark dashboard" page.
This will read the details of experiments in your results and show you the details of pipelines used in that experiment and the metrics used on each pipeline.

Then you can choose a way to aggregate your data for a given metric. The page will then display a bar plot of that metric.

## Running the app
This is an [Observable Framework](https://observablehq.com/framework) app. To start the local preview server, run:

```
npm run dev
```

Then visit <http://localhost:3000> to preview your app.

For more, see <https://observablehq.com/framework/getting-started>.

