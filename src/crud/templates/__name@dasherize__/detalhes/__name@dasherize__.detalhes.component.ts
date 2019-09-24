import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-<%= dasherize(name) %>-detalhes',
    templateUrl: './<%= dasherize(name) %>.detalhes.component.html',
    styleUrls: ['<%= dasherize(name) %>.detalhes.component.scss']
})
export class <%= classify(name) %>DetalhesComponent extends Base implements OnInit {
    params: any;

    constructor(private route: ActivatedRoute,
                private location: Location) {
        super('<%= namedCapitalize(projectName) %> | <%= name %>', <%= size %>);
    }

    ngOnInit() {
        this.params = this.route.snapshot.params;
    }

    buscarPorId() {

    }

    inserir() {
        this.salvar();
    }

    alterar() {
        this.salvar();
    }

    salvar() {

    }

    remover() {

    }
}
