# Heat Streams PowerBI Visual

# About
The HeatStreams Visual is a categorical heat-map encoding of a metric over a time or numeric domain. Users can pick from a variety of color schemes (all provided by d3), and basic selection of categories is provided. Categories may be multi-selected with ctrl+click. 

# Development
This visualization is a Lerna monorepo split into two main components: a React-based data visualization, and a PowerBI wrapper around the visual. The Essex build system is used to construct the visual.

> yarn --ignore-engines # PowerBI insists on a Node 6.x engine, which isn't really necessary
> yarn build            # Transpiles react components, bundles the PowerBI visual under `packages/powerbi-heat-streams/dist`
> yarn start            # Starts up the local PowerBI visual development server

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
