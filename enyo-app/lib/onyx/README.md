### Looking for the issue tracker?
It's moved to [https://enyojs.atlassian.net](https://enyojs.atlassian.net).

---

## Onyx UI Library

Onyx is a UI library for Enyo 2.

We originally set out to adapt the Enyo 1 widgets for use with Enyo 2, but we quickly determined that we could achieve better cross-platform compatibility and build a more solid foundation for the future by starting with a clean slate. The result is a new UI library for Enyo 2 called **Onyx**.

Despite the changes under the hood, you'll find that Onyx is clearly an evolution of the Enyo 1 UI from a design point of view. This first Onyx release features a variety of commonly used widgets, including toolbars, text inputs, checkboxes, groups and multiple types of buttons. Onyx also includes a base `Slideable` control that you can use to implement views that slide back and forth between pre-defined positions, including on and off screen.

To get a feel for Onyx, check out the [OnyxSampler example](http://enyojs.com/samples/onyxsampler). Needless to say, we're not done -- we'll be expanding the Onyx widget set as we go.

## Changes

Any time you commit a change to a `.less` file, you also need to regenerate the
top-level `.css` file for the library, as follows:

    cd lib/onyx/css
    ../../../enyo/tools/lessc.sh ./package.js

This will generate a new `onyx.css`, which you should check in along with your
`.less` changes.

Please do not edit the top-level `onyx.css` file manually.  It should be
treated as an output file; we should make changes to `.less` files only, then
generate the `onyx.css` file using the above command.

## Copyright and License Information

Unless otherwise specified, all content, including all source code files and
documentation files in this repository are:

Copyright (c) 2012-2014 LG Electronics

Unless otherwise specified or set forth in the NOTICE file, all content,
including all source code files and documentation files in this repository are:
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this content except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
