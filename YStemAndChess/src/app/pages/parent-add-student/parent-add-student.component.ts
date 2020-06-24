import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent-add-student',
  templateUrl: './parent-add-student.component.html',
  styleUrls: ['./parent-add-student.component.scss']
})
export class ParentAddStudentComponent implements OnInit {

  link: string = null;
  private studentIndex: number = 0;
  numStudents = new Array();
  private newStudents: Student[] = [];
  newStudentFlag: boolean = false;
  private studentFirstNameFlag: boolean = false;
  private studentLastNameFlag: boolean = false;
  private studentUserNameFlag: boolean = false;
  private studentPasswordFlag: boolean = false;
  private studentRetypeFlag: boolean = false;
  numNewStudents: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.numStudents.push(0);
    this.numNewStudents++;
  }

  studentFirstNameVerification(firstName: any, index: any): boolean {
    firstName = this.allowTesting(firstName, "studentFirstName"+index);

    if (/^[A-Za-z]{2,15}$/.test(firstName)) {
      this.studentFirstNameFlag = true;
      document.getElementById("errorFirstName"+index).innerHTML = "";
      return true;
    } else {
      this.studentFirstNameFlag = false;
      document.getElementById("errorFirstName"+index).innerHTML = "Invalid First Name";
      return false;
    }
  }

  studentLastNameVerification(lastName: any, index: any): boolean {

    lastName = this.allowTesting(lastName, "studentLastName"+index);

    if (/^[A-Za-z]{2,15}$/.test(lastName)) {
      this.studentLastNameFlag = true;
      document.getElementById("errorLastName"+index).innerHTML="";
      return true;
    } else {
      this.studentLastNameFlag = false;
      document.getElementById("errorLastName"+index).innerHTML="Invalid Last Name";
      return false;
    }
  }

  studentUsernameVerification(username: any, index: any): boolean {
    username = this.allowTesting(username, 'studentUsername'+index);

    if (/^[a-zA-Z](\S){1,14}$/.test(username)) {
      //check username against database
      this.studentUserNameFlag = true;
      document.getElementById("errorUsername"+index).innerHTML = "";
      return true;
    } else {
      this.studentUserNameFlag = false;
      document.getElementById("errorUsername"+index).innerHTML = "Invalid Username";
      return false;
    }
  }

  studentPasswordVerification(password: any, index: any): boolean {
    password = this.allowTesting(password, 'studentPassword'+index);

    if (password.length < 8) {
      this.studentPasswordFlag = false;
      document.getElementById("errorPassword"+index).innerHTML="Invalid Password";
      return false;
    } else {
      //verify password with username
      this.studentPasswordFlag = true;
      document.getElementById("errorPassword"+index).innerHTML="";
      return true;
    }
  }

  studentRetypePasswordVerification(retypedPassword: any, password:any, index: any): boolean {
    retypedPassword = this.allowTesting(retypedPassword, 'studentRetypedPassword'+index);
    password = this.allowTesting(password, 'studentPassword'+index);

    if (retypedPassword === password) {
      this.studentRetypeFlag = true;
      document.getElementById("errorRetype"+index).innerHTML="";
      return true;
    } else {
      this.studentRetypeFlag = false;
      document.getElementById("errorRetype"+index).innerHTML="Passwords do not match";
      return false;
    }
  }

  ifValidStudentAccount(index): boolean {
    this.studentIndex = index;
    if(this.studentFirstNameFlag === true && this.studentLastNameFlag === true && this.studentUserNameFlag === true 
      && this.studentPasswordFlag === true && this.studentRetypeFlag === true) {
        this.link="/login";
        this.newStudents.push(this.addStudentToArray(index));
        console.log(this.newStudents);
        //set them all to false for future students
        this.resetStudentFlags();
        return true;
      } else {
        this.link = null;
        return false;
      }
  }

  private resetStudentFlags(): void {
    this.studentFirstNameFlag = false;
    this.studentLastNameFlag = false;
    this.studentUserNameFlag = false;
    this.studentPasswordFlag = false;
    this.studentRetypeFlag = false;
  }

  private addStudentToArray(index): Student {
    var studentFirstName = (<HTMLInputElement>document.getElementById("studentFirstName"+index)).value;
    var studentLastName = (<HTMLInputElement>document.getElementById("studentLastName"+index)).value;
    var studentUserName = (<HTMLInputElement>document.getElementById("studentUsername"+index)).value;
    var studentPasssword = (<HTMLInputElement>document.getElementById("studentPassword"+index)).value;

    let student: Student = {first: studentFirstName, last: studentLastName, username: studentUserName, password: studentPasssword};
    return student;
  }

  removeNewStudent(click, index): void {
    if(click == event) {
      if(this.numNewStudents == 1){
        this.newStudentFlag = false;
        this.numStudents = [];
        this.numNewStudents = 0;
        this.newStudents = [];
        document.getElementById("create").style.display = "inline"; //show create student button
        return;
      } else {
        document.getElementById("newStudent"+index).style.display = "none";
        this.newStudents[index] = null;
      }
    }
    console.log(this.newStudents);
    this.numNewStudents--;
  }

  addNewStudentForm(click, index): void {
    if(click == event) {
      this.numStudents.push(index);
    }
    this.numNewStudents++;
  }

  students() {
    return this.numStudents;
  }

  clearNulls(arr: any[]) {
    let newarr = [];
    let index = 0;
      while(index < arr.length) {
        if(arr[index] != null) {
          newarr.push(arr[index]);
        }
        console.log(index);
        index++;
      }
    return newarr;
  }

  SendToDataBase(): void {
    console.log(this.studentIndex);
    if (this.ifValidStudentAccount(this.studentIndex)) {
      return;
    }
    var firstName: string = (<HTMLInputElement>document.getElementById("firstName")).value;
    var lastName: string = (<HTMLInputElement>document.getElementById("lastName")).value;
    var password: string = (<HTMLInputElement>document.getElementById("password")).value;
    var username: string = (<HTMLInputElement>document.getElementById("username")).value;
    
    let url: string = "";

    this.newStudents = this.clearNulls(this.newStudents);
    console.log(this.newStudents);
    var students = JSON.stringify(this.newStudents);
    url = `http://127.0.0.1:8000/?reason=create&first=${firstName}&last=${lastName}&email=${email}&password=${password}&username=${username}&role=student&students=${students}`;
    
    this.httpGetAsync(url, (response) => {
      if (response == "This username has been taken. Please choose another.") {
        this.link = "/parent-add-student";
      }
      console.log(response);
    })
  }

  private httpGetAsync(theUrl: string, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
  }

  private allowTesting(userParameter: any, HtmlId: any) {
    if (userParameter == event) {
      return userParameter = (<HTMLInputElement>document.getElementById(HtmlId)).value;
    }
    return userParameter;
  }
}

export interface Student {
  first: string;
  last: string;
  username: string;
  password: string;
}
