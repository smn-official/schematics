import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { <%= classify(name) %>ListaComponent } from './lista/<%= dasherize(name) %>.lista.component';
import { <%= classify(name) %>DetalhesComponent } from './detalhes/<%= dasherize(name) %>.detalhes.component';

export const <%= upperWithUderscore(name) %>_ROUTES: Routes = [{
    <% if(route) { %>path: '<%= route %>/<%= dasherize(name) %>',<% } else { %>path: '<%= dasherize(name) %>',<% } %>
    loadChildren: '<%= path %>/<%= dasherize(name) %>/<%= dasherize(name) %>.module#<%= classify(name) %>Module',
    <% if(convertion) { %>data: { conversao: true }<% } %>
}];

const routes: Routes = [{
    path: '',
    component: <%= classify(name) %>ListaComponent
}, {
    path: 'novo',
    component: <%= classify(name) %>DetalhesComponent
}, {
    path: ':id',
    component: <%= classify(name) %>DetalhesComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class <%= classify(name) %>RoutingModule {
}
