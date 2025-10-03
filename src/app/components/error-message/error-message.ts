import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../../services/message';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-error-message',
  imports: [],
  templateUrl: './error-message.html',
  styleUrl: './error-message.scss'
})
export class ErrorMessage implements OnInit, OnDestroy {
  @Input() title = 'Error';

  message = '';
  hidden = true
  destroy$$ = new Subject();

  constructor(
    private messageService: Message
  ) {

  }

  ngOnDestroy(): void {
    this.destroy$$.next(null);
    this.destroy$$.complete();
  }
  ngOnInit(): void {
    this.messageService.message$.pipe(
      takeUntil(this.destroy$$)
    )
      .subscribe(text => {
      this.hidden = false;
      this.message = text;
    })
  }
}
