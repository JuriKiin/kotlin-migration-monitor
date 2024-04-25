# kotlin-migration-monitor
A Github Action built to output the progress of an android project's migration from Java -> Kotlin.

For example output, check out the [pinned issue](https://github.com/JuriKiin/kotlin-migration-monitor/issues/10)

## Inputs

### directory `String` - `Required`

The starting directory for the file search.

### open-issue `Boolean` - `Optional`

Whether a github issue should be created.

Default is `true`.

### github-token `Secret` - `Required`

The github token for your repository.

**Note: This is automatically created by Github and accessed by:**

`${{ secrets.GITHUB_TOKEN }}`

## Outputs

### java-files `List<String>`

A list of remaining java classes with their respective path.

### Example usage
```
  kotlin-migration-monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
        
      - name: Install Node.js
        run: npm install

      - name: Calculate Migration Progress
        uses: JuriKiin/kotlin-migration-monitor@2024.4.25
        with:
          directory: './path/to/files'
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

Support this project with a ⭐

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/jurikiin)
