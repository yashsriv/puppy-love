import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { contentHeaders } from '../common/headers';
import { Config } from '../config';
import { Crypto } from '../common/crypto';

const styles   = require('./signup.css');
const template = require('./signup.html');

@Component({
  selector: 'signup',
  template: template,
  styles: [ styles ]
})
export class Signup {
  message: string = '';
  crypto: Crypto;

  constructor(public router: Router, public http: Http) {
  }

  signup(event, roll, password, authCode) {
    event.preventDefault();
    let beginData = Crypto.fromJson({
      choices: []
    });

    this.crypto = new Crypto(password);

    let passHash = Crypto.hash(password);

    this.crypto.newKey();

    // Store encrypted private key, public key, and encrypted empty data
    let body = JSON.stringify({
      roll,
      passHash,
      authCode,
      privKey: this.crypto.encryptSym(this.crypto.serializePriv()),
      pubKey: this.crypto.serializePub(),
      data: this.crypto.encryptSym(beginData)
    });

    this.http.post(Config.loginFirstUrl, body, { headers: contentHeaders })
      .subscribe(
        response => {
          this.router.navigate(['login']);
        },
        error => {
          this.message = 'Wrong authentication code!';
          console.log(error.text());
        }
      );
  }

  login(event) {
    event.preventDefault();
    this.router.navigate(['login']);
  }

  mailer(event, roll) {
    event.preventDefault();
    this.http.get(Config.loginMailUrl + roll)
      .subscribe(
        response => {
          this.message = 'Mail sent to your @iitk ID !';
        },
        error => {
          this.message = 'There was an error. Please tell us at pclubiitk@gmail';
        }
      );
  }

}
