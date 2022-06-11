#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const program = require('commander')

const {
  getConfig,
  buildPrettifier,
  logIntro,
  logItemCompletion,
  logConclusion,
  logError,
} = require('./helpers')
const {
  requireOptional,
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise,
} = require('./utils')

const { version } = require('../package.json')

const config = getConfig()

const prettify = buildPrettifier(config.prettierConfig)

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React component to generate (functional, class, pure-class, default is "functional")',
    /^(class|pure-class|functional)$/i,
    config.type
  )
  .option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory (default is "src/components")',
    config.dir
  )
  .option(
    '-x, --extension <fileExtension>',
    'Which file extension to use for the component (default "tsx")',
    config.extension
  )
  .parse(process.argv)

const [componentName] = program.args

// Template Files
const templatePath = `./templates/${program.type}.tsx`
const cssTemplatePath = './templates/cssModule.scss'
const specTemplatePath = './templates/spec.tsx'
const storiesTemplatePath = './templates/stories.tsx'

// Output Files
const componentDir = `${program.dir}/${componentName}`
const indexPath = `${componentDir}/index.${program.extension}`
const componentFilePath = `${componentDir}/${componentName}.component.${program.extension}`
const cssModulePath = `${componentDir}/${componentName}.module.scss`
const specFilePath = `${componentDir}/${componentName}.spec.tsx`
const storiesFilePath = `${componentDir}/${componentName}.stories.tsx`

// Main index template
const indexTemplate = prettify(`\
export * from './${componentName}.component'
export { ${componentName} } from './${componentName}.component'
`)

logIntro({ name: componentName, dir: componentDir, type: program.type })

if (!componentName) {
  logError(
    `You need to specify a name for your component like this: neu-component <name>`
  )
  process.exit(0)
}

const fullPathToParentDir = path.resolve(program.dir)
if (!fs.existsSync(fullPathToParentDir)) {
  logError(
    `You need to create a parent "components" directory.\n(neu-component is looking for a directory at ${program.dir}).`
  )
  process.exit(0)
}

const fullPathToComponentDir = path.resolve(componentDir)
if (fs.existsSync(fullPathToComponentDir)) {
  logError(
    `There's already a component at ${componentDir}.\nPlease delete this directory and try again.`
  )
  process.exit(0)
}

// Start by creating the directory that our component lives in.
mkDirPromise(componentDir)
  .then(() => readFilePromiseRelative(templatePath))
  .then((template) => {
    logItemCompletion('Directory created.')
    return template
  })
  // Replace our placeholders with real data (so far, just the component name)
  .then((template) => template.replace(/COMPONENT_NAME_/g, componentName))
  // Format it using prettier, to ensure style consistency, and write to file.
  .then((template) => writeFilePromise(componentFilePath, prettify(template)))
  .then((template) => {
    logItemCompletion('Component built and saved to disk.')
    return template
  })
  // Create main index file
  .then((template) => writeFilePromise(indexPath, prettify(indexTemplate)))
  .then((template) => {
    logItemCompletion('Index file built and saved to disk.')
    return template
  })
  // Create CSS module file
  .then((template) => {
    return readFilePromiseRelative(cssTemplatePath)
      .then((template) => template.replace(/COMPONENT_NAME_/g, componentName))
      .then((cssTemplate) => {
        return writeFilePromise(cssModulePath, cssTemplate)
      })
  })
  .then((template) => {
    logItemCompletion('SCSS Module built and saved to disk.')
    return template
  })
  // Create spec file
  .then((template) => {
    return readFilePromiseRelative(specTemplatePath)
      .then((template) => template.replace(/COMPONENT_NAME_/g, componentName))
      .then((specTemplate) => {
        return writeFilePromise(specFilePath, specTemplate)
      })
  })
  .then((template) => {
    logItemCompletion('Spec file built and saved to disk.')
    return template
  })
  // Create spec file
  .then((template) => {
    return readFilePromiseRelative(storiesTemplatePath)
      .then((template) => template.replace(/COMPONENT_NAME_/g, componentName))
      .then((storiesTemplate) => {
        return writeFilePromise(storiesFilePath, storiesTemplate)
      })
  })
  .then((template) => {
    logItemCompletion('Stories file built and saved to disk.')
    return template
  })
  .then((template) => {
    logConclusion(componentName)
  })
  .catch((err) => {
    console.error(err)
  })
