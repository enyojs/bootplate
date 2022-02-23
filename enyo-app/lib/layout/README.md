### Looking for the issue tracker?
It's moved to [https://enyojs.atlassian.net](https://enyojs.atlassian.net).

---

This is a layout library for Enyo 2. This library provides a collection of
layout functionality

## List

The list package provides a `List` control that displays a scrolling list of
rows. It's suitable for displaying very large lists and is optimized such that
only a small portion of the list is rendered at a given time.

Check out the List samples in the Layout section of the
[Enyo Sampler](http://enyojs.com/sampler/) to see the control in action. For
more information, see the [List documentation](https://github.com/enyojs/enyo/wiki/Lists)
in the Enyo Developer Guide.

## Fittable

The fittable package helps you create layouts that expand to fit available
space--a common need for apps, but one that has historically been difficult
to meet using Web technologies.

The `FittableColumns` and `FittableRows` controls let you define views whose
children are arranged either horizontally or vertically. Within a given view,
you can designate one child to expand and contract to fit the available space,
while its siblings retain their natural or explicitly-specified sizes. Fittable
views may be nested as needed.

If you're thinking that this sounds a lot like a limited version of the CSS
Flexible Box Model, you're right. Our main objective was to provide a layout
model with capabilities similar to Flex Box, but with greater browser
compatibility. We also wanted to impose as few limitations as possible on the
CSS styling of child components, and to use JavaScript sparingly (we use it to
calculate the height of fittable elements, but otherwise leave the layout work
to the browser).

As much as we like them, we want to emphasize that you should only use
`FittableColumns` and `FittableRows` when you need views to expand and
contract to fit available space. If you simply want to arrange elements
horizontally or vertically, you're better off employing standard Web layout
techniques.

Check out the
[Fittable sample](http://enyojs.com/samples/fittable/app-layouts.html) to
see `FittableColumns` and `FittableRows` in action.

## Panels

The `enyo.Panels` kind is designed to satisfy a variety of common use cases
for application layout. Using `enyo.Panels`, controls may be arranged as
(among other things) a carousel, a set of collapsing panels, a card stack
that fades between panels, or a grid.

For more information, see the [Panels documentation](https://github.com/enyojs/enyo/wiki/Panels)
on the Enyo wiki.

## Slidable

Slideable is a control that can be dragged either left-to-right or up-and-down
between a minimum and a maximum value. When released from dragging, a Slideable
will animate to its minimum or maximum position based on the direction dragged.

## Tree

Tree is a control showing a vertical list of labels with nesting and collapsing
of hierarchy levels.  There's a simple example in the
[Enyo Sampler](http://enyojs.com/sampler/) showing the control in use as a
directory and file tree.

## Easing

Easing extends `enyo.easing`, by including thirty additional interpolation methods.  There's a simple example in the
[Easing sample](https://github.com/enyojs/lib/layout/easing/samples) folder, showing how to implement these methods. View the
[Easing source](https://github.com/enyojs/lib/layout/easing/source/Easing.js) to see a list of supported easing methods.

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
