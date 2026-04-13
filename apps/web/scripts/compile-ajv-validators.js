const fs = require('fs')
const path = require('path')
const Ajv = require('ajv')
const standaloneCode = require('ajv/dist/standalone').default
const addFormats = require('ajv-formats')
const { _ } = require('ajv')
const schema = require('../src/utils/tokenlist.schema.json')
