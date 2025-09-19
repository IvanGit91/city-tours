import {animate, query, state, style, transition, trigger} from '@angular/animations';

export function routerTransition() {
  return slideToTop2();
}

export function slideToRight() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(100%)'}))
    ])
  ]);
}

export function slideToLeft() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({transform: 'translateX(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(-100%)'}))
    ])
  ]);
}

export function slideToBottom() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({transform: 'translateY(-100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(100%)'}))
    ])
  ]);
}

export function slideToTop() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({transform: 'translateY(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(-100%)'}))
    ])
  ]);
}


export function slideToTop2() {
  return trigger('routerTransition', [
    state('void', style({})),
    state('*', style({})),
    transition(':enter', [
      style({opacity: 0, transform: 'translateY(5%)'}),
      animate('0.2s ease-in-out', style({opacity: 1, transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({opacity: 1, transform: 'translateY(0%)'}),
      animate('0.2s ease-in-out', style({opacity: 0, transform: 'translateY(-5%)'}))
    ])
  ]);
}

export function myAnimation() {
  return trigger('routerTransition', [
    transition('* => *', [
      query(
        ':enter',
        [style({opacity: 0})],
        {optional: true}
      ),
      query(
        ':leave',
        [style({opacity: 1}), animate('0.3s', style({opacity: 0}))],
        {optional: true}
      ),
      query(
        ':enter',
        [style({opacity: 0}), animate('0.3s', style({opacity: 1}))],
        {optional: true}
      )
    ])
  ]);
}

export function flyInOut() {

  return trigger('routerTransition', [
    state('in', style({transform: 'translateX(0)'})),
    transition('void => *', [
      style({transform: 'translateX(-100%)'}),
      animate(100)
    ]),
    transition('* => void', [
      animate(100, style({transform: 'translateX(100%)'}))
    ])
  ]);
}

export function fadeAnimation() {
  return trigger('routerTransition', [
    // the "in" style determines the "resting" state of the element when it is visible.
    state('in', style({opacity: 1})),
    // fade in when created. this could also be written as transition('void => *')
    transition(':enter', [
      style({opacity: 0}),
      animate(600)
    ]),
    // fade out when destroyed. this could also be written as transition('void => *')
    transition(':leave',
      animate(600, style({opacity: 0})))
  ]);
}
