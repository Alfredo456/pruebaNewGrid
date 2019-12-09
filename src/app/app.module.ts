import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { IgxGridModule, IgxAvatarModule, IgxBadgeModule, IgxButtonModule, IgxIconModule, IgxInputGroupModule, IgxProgressBarModule, IgxRippleModule, IgxSwitchModule, IgxDialogModule, IgxComboModule } from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";
import { ContextmenuComponent } from './home/contextmenu/contextmenu.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContextmenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IgxGridModule.forRoot(),

    FormsModule,
    IgxAvatarModule,
    IgxBadgeModule,
    IgxButtonModule,
    IgxGridModule,
    IgxIconModule,
    IgxInputGroupModule,
    IgxProgressBarModule,
    IgxRippleModule,
    IgxSwitchModule,
    HttpClientModule,
    IgxDialogModule,
    IgxComboModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
