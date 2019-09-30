import { Container } from "inversify";
import { TYPES } from "./types";

import {CollectController} from './lib/controller/collectController'

const InversifyContainer = new Container();

InversifyContainer.bind<CollectController>(TYPES.CollectController).to(CollectController);

export {InversifyContainer}