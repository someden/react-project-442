import { createRoot } from 'react-dom/client'
import init from './init'
import type { TalentClass } from "./types";
import demo from "../__fixtures__/demo.json";

createRoot(document.getElementById('root')!).render(init(demo as TalentClass))
