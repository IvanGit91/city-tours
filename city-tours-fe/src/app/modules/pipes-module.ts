import {NgModule} from '@angular/core';

import {ExponentialStrengthPipe} from "../shared/pipes/ExponentialStrenghtPipe";
import {FormatDataPipe} from "../shared/pipes/FormatDataPipe";
import {CutTextPipe} from "../shared/pipes/CutTextPipe";
import {FilterPipe} from "../shared/pipes/FilterPipe";
import {UppercaseAddTextPipe} from "../shared/pipes/UppercaseAddTextPipe";

@NgModule({
  imports: [],
  exports: [
    ExponentialStrengthPipe,
    CutTextPipe,
    FormatDataPipe,
    FilterPipe,
    UppercaseAddTextPipe
  ],
  declarations: [
    ExponentialStrengthPipe,
    CutTextPipe,
    FormatDataPipe,
    FilterPipe,
    UppercaseAddTextPipe
  ]
})
export class PipesModule {
}
