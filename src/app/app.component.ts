import { Component } from '@angular/core'
import { Conversor } from 'src/domain/conversor'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Conversor'
  conversor = new Conversor()
}
