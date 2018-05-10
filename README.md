# csp-hash-from-html

Generate hashes from inline scripts and styles in HTML file to be used in Content-Security-Policy header.

## Installation


`npm install github:apaatsio/csp-hash-from-html`


## Usage

### Command line


```
Usage: csp-hash [options] <fileOrGlob>

  Options:

    -V, --version            output the version number
    -a, --algorithm <value>  hash algorithm (sha256, sha384, sha512) (default: sha256)
    -h, --help               output usage information

  Examples:

    $ csp-hash index.html
    $ csp-hash -a sha512 index.html
    $ csp-hash build/**/*.html
```

Outputs list of formatted hashes of every inline script and style element. The 
output can then be used in the `default-source` directive in the 
`Content-Security-Policy` header.

For example:

```
$ csp-hash index.html
'sha256-gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=' 'sha256-kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y='
```

Copy-paste the output into your header so that it will look like this:

`Content-Security-Policy: default-src 'sha256-gaaMFNHZyRta8zB2VHkWLMP4tMxJ+d8v3dTW7nw2r6M=' 'sha256-kF9IMyq2dRDM9gvQudKN9ARqpa77NAo1QPYqEiRG37Y=';`
