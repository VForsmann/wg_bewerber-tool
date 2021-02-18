import { customElement, html, LitElement, property, query } from "lit-element";
import {ifDefined} from 'lit-html/directives/if-defined';
import { PageMixin } from "../../client-packages/page-mixin/page.mixin";
import { router } from "../../client-packages/router/router";
import Applicant from "../../interfaces/applicant";
import './applicant-list.scss';

@customElement('applicant-list')
export default class WebRoot extends PageMixin(LitElement) {

    applicants: Applicant[] = [];
    filteredApplicants: Applicant[] = this.applicants;

    @property() filterDefault = ["Männlich", "Weiblich"];
    @property() searchDefault = "";
    @property() sortValue = "Neuste zuerst...";

    @query('#filter')
    multiSelect!: any;

    render() {
        this.applySearch();
        this.applyGenderFilter();
        this.applySort();

        return html`
        <form>
            <div class="form-group">
                <input @input="${(event: any) => {
                        this.searchDefault = event.target.value;
                        window.localStorage.setItem("searchDefault", this.searchDefault);
                        
                    }}" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                    value="${this.searchDefault ? this.searchDefault : ""}" placeholder="${this.searchDefault ? "" : "Suche..."}">
            </div>

            <multiselect-combo-box @change="${(event: any) => {
                        this.filterDefault = event.target.selectedItems;
                        window.localStorage.setItem("filterDefault", this.filterDefault.toString());
                    }}" id="filter" placeholder="Geschlecht"></multiselect-combo-box>
        
            <div class="form-group">
                <select @input="${((event: any) => {
                        this.sortValue = event.target.value;
                        window.localStorage.setItem("sortValue", this.sortValue);
            }
                    )}" required class="form-control" id="gender">
                    <option selected="${ifDefined(this.sortValue === "Neuste zuerst..." ? "selected" : undefined)}">Neuste zuerst...</option>
                    <option selected="${ifDefined(this.sortValue === "Bestes Rating zuerst..." ? "selected" : undefined)}">Bestes Rating zuerst...</option>
                </select>
            </div>
        </form>
        <hr>
        <ul class="list-group">
            ${this.filteredApplicants.map(applicant => {
            return html`
            <li @click="${() => router.navigate(`/applicant?id=${applicant.id}`)}"
                class="list-group-item d-flex justify-content-between align-items-center">
                <div class="applicant">
                    ${applicant.name}
                    <div>
                        <span class="badge badge-pill ${applicant.gender === "Männlich" ? "men" : "female"
                    }">${applicant.gender}</span>
                        <span class="badge badge-secondary badge-pill">${Math.round(Object.values(applicant.ratings).reduce((p:
                            number, c: number) => p + c, 0) / Object.keys(applicant.ratings).length * 100) / 100}</span>
                    </div>
                </div>
        
            </li>
            `
        })}
        </ul>
        </div>
        `
    }

    firstUpdated() {

        
        const searchDefault = window.localStorage.getItem("searchDefault");
        if(searchDefault) {
            this.searchDefault = searchDefault;
        }

        const filterDefault = window.localStorage.getItem("filterDefault");
        if(filterDefault) {
            this.filterDefault = filterDefault.split(",");
        }

        const sortValue = window.localStorage.getItem("sortValue");
        if(sortValue) {
            this.sortValue = sortValue;
        }

        this.multiSelect.items = ['Männlich', 'Weiblich'];
        this.multiSelect.selectedItems = this.filterDefault;
        this.fetchApplicants();
    }

    fetchApplicants() {
        window.database.ref("applicants").on("value", (snapshot) => {
            const array: Applicant[] = [];
            snapshot.forEach((applicantSnap: any) => {
                array.push(applicantSnap.val())
            });
            this.applicants = array;
            this.filteredApplicants = array;
            this.requestUpdate();
        })
    }

    applySearch() {
        this.filteredApplicants = this.applicants.filter((g: any) => {
            let isIn = false;
            for (let prop in g) {
                if (!g[prop]) continue;
                isIn = g[prop].toString() ? g[prop].toString().toLowerCase().includes(this.searchDefault.toLowerCase()) : false;
                if (isIn) break;
            }
            return isIn;
        })
    }

    applyGenderFilter() {
        this.filteredApplicants = this.filteredApplicants.filter(applicant => this.filterDefault.includes(applicant.gender));
    }

    applySort() {
        switch (this.sortValue) {
            case "Neuste zuerst...": {
                this.filteredApplicants.sort((a: Applicant, b: Applicant) => {
                    return b.when - a.when;
                });
                break;
            }
            case "Bestes Rating zuerst...": {
                this.filteredApplicants.sort((a: Applicant, b: Applicant) => {
                    const ratingA = Math.round(Object.values(a.ratings).reduce((p: number, c: number) => p + c, 0) / Object.keys(a.ratings).length * 100) / 100;
                    const ratingB = Math.round(Object.values(b.ratings).reduce((p: number, c: number) => p + c, 0) / Object.keys(b.ratings).length * 100) / 100;
                    return ratingB - ratingA;
                });
                break;
            }
        }
        this.requestUpdate();
    }


}