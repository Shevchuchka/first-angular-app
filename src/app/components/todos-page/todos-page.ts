import { Component, OnInit } from '@angular/core';
import { Todo } from '../../types/todo';
import { Todos } from '../../services/todos';
import { Message } from '../../services/message';
import { TodoComponent } from '../todo/todo';
import { TodoForm } from '../todo-form/todo-form';
import { ErrorMessage } from '../error-message/error-message';
import { AsyncPipe } from '@angular/common';
import { map, Observable, switchMap } from 'rxjs';
import { Filter } from "../filter/filter";
import { ActivatedRoute } from '@angular/router';
import { Status } from '../../types/status';

@Component({
  selector: 'app-todos-page',
  imports: [
    TodoComponent,
    TodoForm,
    ErrorMessage,
    AsyncPipe,
    Filter
],
  templateUrl: './todos-page.html',
  styleUrl: './todos-page.scss'
})
export class TodosPage implements OnInit{
  todos$: Observable<Todo[]>;
  activeTodos$: Observable<Todo[]>;
  completedTodos$: Observable<Todo[]>;
  activeCount$: Observable<number>;
  visibleTodos$: Observable<Todo[]>;

  constructor(
    private todosService: Todos,
    private messageService: Message,
    private route: ActivatedRoute
  ) {
    this.todos$ = this.todosService.todos$;

    this.activeTodos$ = this.todos$.pipe(
      map(todos => todos.filter(todo => !todo.completed))
    );

    this.completedTodos$ = this.todos$.pipe(
      map(todos => todos.filter(todo => todo.completed))
    );

    this.activeCount$ = this.activeTodos$.pipe(
      map(todos => todos.length)
    );

    this.visibleTodos$ = this.route.params.pipe(
      switchMap(params => {
        switch(params['status'] as Status) {
          case 'active':
            return this.activeTodos$;
          case 'completed':
            return this.completedTodos$
          default:
            return this.todos$;
        }
      }
    ))
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params)
     })
    this.todosService.loadTodos()
      .subscribe({
        error: () => this.messageService.showMessage('Failed to load todos.')
      });
  }

  addTodo(newTodoTitle: string) {
    this.todosService.createTodo(newTodoTitle)
      .subscribe({
        error: () => this.messageService.showMessage('Failed to create todo. ')
      });
  }

  toggleTodo(todo: Todo) {
    this.todosService.updateTodo({
      ...todo,
      completed: !todo.completed,
    })
      .subscribe({
        error: () => this.messageService.showMessage('Failed to update todo.')
      });
  }

  renameTodo(todo: Todo, newTitle: string) {
    this.todosService.updateTodo({ ...todo, title: newTitle })
      .subscribe({
        error: () => this.messageService.showMessage('Failed to update todo.')
      });
  }

  deleteTodo(todo: Todo) {
    this.todosService.deleteTodo(todo)
      .subscribe({
        error: () => this.messageService.showMessage('Failed to delete todo.')
      });
  }
}
