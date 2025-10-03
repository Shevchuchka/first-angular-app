import { Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { Todo } from '../../types/todo';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  imports: [FormsModule],
  templateUrl: './todo.html',
  styleUrl: './todo.scss'
})

export class TodoComponent {
  @Output() delete = new EventEmitter();
  @Output() toggle = new EventEmitter();
  @Output() rename = new EventEmitter<string>();
  @Input() todo!: Todo;

  @ViewChild('titleField')
  set titleField(field: ElementRef) {
    if (field) {
      field.nativeElement.focus();
    }
  };

  editing = false;
  todoTitle = '';

  edit() {
    this.editing = true;
    this.todoTitle = this.todo.title;
  }

  save() {
    if (!this.editing) {
      return
    }

    this.editing = false;
    this.rename.emit(this.todoTitle);
  }
}
