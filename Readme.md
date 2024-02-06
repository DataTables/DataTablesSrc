
# DataTables plug-in for jQuery

This git repository contains the un-built source files for DataTables - an HTML table enhancing library. If you are looking to use DataTables, please use our [download builder](https://datatables.net/download), which include [CDN](https://cdn.datatables.net) and package options, including NPM.


## Installing DataTables

To use DataTables, the primary way to obtain the software is to use the [DataTables downloader](//datatables.net/download). You can also include the individual files from the [DataTables CDN](//cdn.datatables.net). See the [documentation](//datatables.net/manual/installation) for full details.

### NPM, NuGET and Composer

If you prefer to use a package manager such as NPM, NuGET or Composer, distribution repositories are available with software built from this repository under the name `datatables.net`. Styling packages for Bootstrap, Foundation and other styling libraries are also available by adding a suffix to the package name.

Please see the DataTables [download page](//datatables.net/download) for further information. The [DataTables installation manual](//datatables.net/manual/installation) also has details on how to use package managers with DataTables.



## Building

DataTables can be built using the [`make.sh`](build/make.sh) script in the [`/build`](build) directory of this repo. Simply check out the repo, cd into the `build` folder and run `bash make.sh --help` to get a full list of the options available for the build process. `bash make.sh build` will be the most common (with `bash make.sh build debug` available for quick testing - it skips the minification steps for speed).

A number of programs are required out your computer to be able to build DataTables:

* Bash
* PHP 7+
* Node.js 20+

The build script assumes that a Mac or Linux environment is being used - Windows builds are not currently directly supported (although would be possible using [Cygwin](https://www.cygwin.com/)). Additionally, you may need to alter the paths for the above programs to reflect where they are installed on your own computer - this can be done in the [`build/include.sh`](build/include.sh) script.

The output files are placed into `built/DataTables/` which is a temporary directory. No changes should be made in that directory as they will be **overwritten** when you next build the software.

To run locally, do the following

```bash
git clone https://github.com/DataTables/DataTablesSrc
cd DataTablesSrc
cd build
./make.sh examples
./make.sh build
cd ../built/examples
php -S localhost:8300
```

and now open http://localhost:8300/examples/

## Documentation

Full documentation of the DataTables options, API and plug-in interface are available on the [DataTables web-site](//datatables.net). The site also contains information on the wide variety of plug-ins that are available for DataTables, which can be used to enhance and customise your table even further.


## Support

Support for DataTables is available through the [DataTables forums](//datatables.net/forums) and [commercial support options](//datatables.net/support) are available.


## License

DataTables is release under the [MIT license](//datatables.net/license). You are free to use, modify and distribute this software, but all copyright information must remain.
