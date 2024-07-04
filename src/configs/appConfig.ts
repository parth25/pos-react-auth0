import { AppConfig } from 'src/types/global'
import auth from './auth'
import * as process from 'process'
import crypto from 'crypto'
// @ts-ignore
import packageInfo from 'package.json'

const appConfig: AppConfig = {
  auth: auth,
  backend_base_url: "" as string,
  machine_learning_base_url: "" as string,
  randomString: process.env.RANDOM_STRING || crypto.randomBytes(1999).toString('hex'),
  version: packageInfo.version
}

export default appConfig
