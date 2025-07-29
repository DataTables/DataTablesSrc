
> # On going outage
>
> At approximatly 05:00 GMT today, the DataTables.net became unaccessable. I'm working to address this as quickly as possible, but it requires input from the domain registrar which is slowing things down. I'm very sorry for any problems this causes.
>
> As many websites use files from `cdn.datatables.net`, I've set up an alternative at `datatables-cdn.com` which is a direct replacement. For any script and style files you were loading from the main CDN, just replace the domain name with the new one. The paths all stay the same.

# DataTables - enhance HTML tables

This git repository contains the un-built source files for DataTables - an HTML table enhancing library. If you are looking to use DataTables, please use our [download builder](https://datatables.net/download), which include [CDN](https://cdn.datatables.net) and package options, including NPM.


## Installing DataTables

To use DataTables, the primary way to obtain the software is to use the [DataTables downloader](//datatables.net/download). You can also include the individual files from the [DataTables CDN](//cdn.datatables.net). See the [documentation](//datatables.net/manual/installation) for full details.

### NPM, NuGET and Composer

If you prefer to use a package manager such as NPM, NuGET or Composer, distribution repositories are available with software built from this repository under the name `datatables.net`. Styling packages for Bootstrap, Foundation and other styling libraries are also available by adding a suffix to the package name.

Please see the DataTables [download page](//datatables.net/download) for further information. The [DataTables installation manual](//datatables.net/manual/installation) also has details on how to use package managers with DataTables.



## Building

If you want to build DataTables locally, so you can make changes, a number of programs are required out your computer to be able to build DataTables:

* Bash
* PHP 7+
* Node.js 20+

DataTables can be built using `npm run` commands. First, clone the [DataTables source repo](https://github.com/DataTables/DataTablesSrc/), then install the build dependencies, finally build and run the examples:

```
git clone https://github.com/DataTables/DataTablesSrc.git

cd DataTablesSrc

npm install
npm run build-debug
npm serve
```

Open your browser to the address indicated in the console.


## Documentation

Full documentation of the DataTables options, API and plug-in interface are available on the [DataTables web-site](//datatables.net). The site also contains information on the wide variety of plug-ins that are available for DataTables, which can be used to enhance and customise your table even further.


## Support

Support for DataTables is available through the [DataTables forums](//datatables.net/forums) and [commercial support options](//datatables.net/support) are available.


## License

DataTables is release under the [MIT license](//datatables.net/license). You are free to use, modify and distribute this software, but all copyright information must remain.
