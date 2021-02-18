import { customElement, html, LitElement, property, query } from "lit-element";
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import {ifDefined} from 'lit-html/directives/if-defined';
import { PageMixin } from "../../client-packages/page-mixin/page.mixin";
import { router } from "../../client-packages/router/router";
import Applicant from "../../interfaces/applicant";

import './single-applicant.scss';

@customElement('single-applicant')
export default class WebRoot extends PageMixin(LitElement) {

    @property() applicant: Applicant | undefined = undefined;

    @query('#till')
    tillsRating!: HTMLSelectElement;

    @query('#lea')
    leasRating!: HTMLSelectElement;

    @query('#maike')
    maikesRating!: HTMLSelectElement;

    render() {
        return html`
        <div class="text-container">
            <h3>${this.applicant?.name}</h3>
            <h3>${this.applicant?.gender}</h3>
            <hr>
            <div class="rating-menu">
                ${this.applicant ? Object.keys(this.applicant!.ratings).map(key => {
                    return html`
                    <div class="form-group">
                        <label for="${key}">${key.toUpperCase()}</label>
                        <select @input="${this.rate}" class="form-control" id="${key}">
                            <option selected="${ifDefined((this.applicant!.ratings as any)[key] === 1 ? "selected" : undefined)}">1</option>
                            <option selected="${ifDefined((this.applicant!.ratings as any)[key] === 2 ? "selected" : undefined)}">2</option>
                            <option selected="${ifDefined((this.applicant!.ratings as any)[key] === 3 ? "selected" : undefined)}">3</option>
                            <option selected="${ifDefined((this.applicant!.ratings as any)[key] === 4 ? "selected" : undefined)}">4</option>
                            <option selected=${ifDefined((this.applicant!.ratings as any)[key] === 5 ? "selected" : undefined)}>5</option>
                        </select>
                    </div>
                    `
                }): html``}
            </div>
            <hr>
            <h6>${unsafeHTML(this.applicant?.text.replaceAll('\n', '<br>'))}</h6>
            <hr>
            <button @click="${() => router.navigate("/")}" class="btn btn-outline-dark btn-sm">Zurück zur Übersicht</button>
        </div>

        `
    }

    firstUpdated() {
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get("id");
        const ref = window.database.ref('applicants/' + id);
        ref.on("value", (snapshot) => {
            this.applicant = snapshot.val();
        }, (error: any) => {
            if(error) {
                alert("Leider ist etwas schiefgelaufen..");
                console.error(error);
            }
        })
    }

    rate() {
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get("id");
        const ref = window.database.ref('applicants/' + id);
        const ratings = {
            till: parseInt(this.tillsRating.value),
            lea: parseInt(this.leasRating.value),
            maike: parseInt(this.maikesRating.value)
        }
        ref.update({
            ratings
        }, (error: any) => {
            if(error) {
                alert("Leider ist etwas schiefgelaufen..");
                console.error(error);
            }

        })

    }

}