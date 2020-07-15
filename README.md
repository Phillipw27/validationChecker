# validationChecker
validationChecker is a package to help with validation needs.<br/>
Use ```npm i validationchecker``` to install this into your project.<br/>
Require the script or put at the top of your main file. In laravel I create a main blade view that contains the all of my meta data, css and js needed for set views. 
Once you've required the file, you can add <br/> 
```javascript
$("form").on("submit", function(e) {
        var form = this;
        let validation = new validationChecker(form);
        if (validation) {
            if (validation.includes(false)) {
                return false;
            } else {
                return true;
            }
        }
    });
```
Once you put this in, ANY form element is accessible to the files. There are multiple options for validation.</br>
For baisc validation (checking if a field is filled out, checkbox is checked, input has a value) all you have to do is add the class ```validationChecker```. <br/>
If all you want is this as validation, make sure its the last class in your input/textarea field like in the example below.</br>
To make sure the error text message is displayed add in a div right below your input/textarea like below.<br/>
### Text Area Example
```html 
<textarea class="form-control validationChecker" cols="30" rows="10"></textarea>
<div class="form-text text-muted"></div>
```
The message that will show is ```"Please input information into the text area"``` for the html above, but if you would like to include a custom error message, you just need to add the attribute error-message.
```html
<textarea class="form-control validationChecker" cols="30" rows="10" error-message="This is my custom error message"></textarea>
 <div class="form-text text-muted"></div>
```
### Input Examples
#### Text Fields
Here's a regular use case example below. This will make sure that there is a value in the text field.<br/>
```html
<input  type="text" class="form-control validationChecker">
 <div class="form-text text-muted"></div>
 ```
 If you'd like your own custom message you can add in 
 ```html
<input  type="text" class="form-control validationChecker" error-message="Custom Message will go here">
 <div class="form-text text-muted"></div>
 ```
 Input text fields have a rule attached though. If you'd like to specify a minimum length for the text input field then just add the class ```tl-min-(number)```.<br/>
 ```html
 <input  type="text" class="form-control validationChecker tl-min-5">
 <div class="form-text text-muted"></div>
```

#### Email Fields
For email fields, just add the class email to the end after validationChecker like below

```html
<input  type="email" class="form-control validationChecker email">
<div class="form-text text-muted"></div>
```
This will actually run the email through a regex script that checks to make sure there is an ```@``` symbol as well as a ```.``` which is more than browsers will do.

#### Checkbox
Example
```html
<input  type="checkbox" class="validationChecker">
<div class="form-text text-muted"></div>
```

### Select Fields
For select fields, just make sure your first option has a value equal to 0. This option is the option it checks against.<br/>
Example:
```html
<select class="form-control validationChecker">
   <option value="0">Please Select an Option</option>
   <option>HTML</option>
   <option>CSS</option>
   <option>Javascript</option>
   <option>Bootstrap</option>
   <option>AngularJs</option>
</select>
<div class="form-text text-muted"></div>
```

### Developer Note
##### I would not use this on any front end facing items. I would only use this if its behind an Auth service and users are trusted
I'm continually working on this package in my spare time. I've got bigger plans for this in the future and will try to update this as much as possible.
