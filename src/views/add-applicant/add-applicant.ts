import { customElement, html, LitElement, query } from "lit-element";
import { PageMixin } from "../../client-packages/page-mixin/page.mixin";

import './add-applicant.scss';

@customElement('add-applicant')
export default class WebRoot extends PageMixin(LitElement) {

    @query("form")
    form!: HTMLFormElement;

    @query('#name')
    nameInput!: HTMLInputElement;

    @query('#gender')
    genderInput!: HTMLInputElement;

    @query('#text')
    textInput!: HTMLInputElement;

    render() {
        return html`
        <form class="form">
            <div class="form-group">
                <label for="name">Name</label>
                <input required type="text" class="form-control" placeholder="Max Mustermann" id="name">
        
            </div>
            <div class="form-group">
                <label for="gender">Geschlecht</label>
                <select required class="form-control" placeholder="Test" id="gender">
                    <option>Männlich</option>
                    <option>Weiblich</option>
                </select>
            </div>
            <div class="form-group">
                <label for="text">Bewerbertext</label>
                <textarea required class="form-control" id="text" rows="10"></textarea>
            </div>

        </form>
        <button @click="${this.submit}" class="btn btn-primary">Übermitteln</button>
        `
    }

    submit() {
        if(this.form.reportValidity()) {
            const ref = window.database.ref('applicants');
            var newRef = ref!.push()!;
            const key = newRef.key;
            newRef.set({
                when: Date.now(),
                name: this.nameInput.value,
                gender: this.genderInput.value,
                text: this.textInput.value,
                id: key,
                ratings: {
                    till: 1,
                    lea: 1,
                    maike: 1
                }
            }, error => {
                if(!error) {
                    this.nameInput.value = "";
                    this.textInput.value = "";
                    this.genderInput.value = "Männlich";
                    alert("Speichern erfolgreich")
                } else {
                    alert("Es ist etwas schief gegangen!")
                }
            });
        }
    }
}