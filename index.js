class validationChecker{
    
    
    /**
     * This was created to take the trouble and pain out of adding checks on every page for incomplete input items
     * This class is pulled in and referenced in app.blade.php and should only be used for admin panel items
     * When any admin form is submitted all of the elements within that form are sent here.
     * The constructor pulls out each input or select item and grabs the name of each
     * It then checks to see if there is a method with that same name in all of the inputs and selects
     * If the input name matches the method name, it runs that method and does the enclosed code 
     *
     * ------Method Information -----------
     * Each method should pull in two parameters {item} and {self}
     * {item} references the actual input or select item its checking against
     * {self} references this to keep the Class Object intact
     * The only time a method should return false is when you don't want the form to be submitted because of an error
     * On failure a method should call showResult passing in 3 paramaters {item},{message}, {classtype}
     * {item} - you guessed it... reference of input or select item.
     * {message} - This is the message you want to display on the front end to the user
     * {classtype} - If you would like the text to show red and the box border to be red, include 'error' and it will take care of it
     */


    //Variables needed
    message = "";
    classType = "";
    //function needed... for some reason putting it above the constructor allows us to access it across the class
    //before, we couldn't
    /**
     * @param item - actual input field
     * @param message - message to display
     * @param classtype - class name to add to the item 
     * 
     */
    showResult = function(item, message, classtype){
        if(!item.className.includes('error')){
            item.className += ' '+classtype;
        }
        item.nextElementSibling.innerHTML = message;
        if(!item.nextElementSibling.className.includes('error')){
        item.nextElementSibling.className += ' '+classtype;
        }
        return true;
    }

    constructor(form){
        var input = form.getElementsByTagName('input');
        var select = form.getElementsByTagName('select');
        var textArea = form.getElementsByTagName('textarea');
        var dependents = [...this.findDependents(input), ...this.findDependents(select),...this.findDependents(textArea)];
        var newArr = [...input, ...select, ...textArea];
        let self = this;
        let arr = [];
            newArr.forEach((item) => {
                
                var checker = false;
                var name = item.getAttribute('name');
                var classes = item.getAttribute('class');
                
                if(classes){
                    var incoming = classes.split(" ");
                    if(incoming[incoming.length - 1] == "validationChecker" || (incoming[incoming.length - 1] == "error" && incoming[incoming.length - 2] == "validationChecker")){
                        if(item.nodeName === "SELECT"){
                            var selectFunc = this["selectFunc"];
                            if(typeof selectFunc == "function"){
                            arr.push(selectFunc(item, self));
                            }
                        }
                        else if(item.nodeName === "INPUT"){
                            var inputFunc = this["inputFunc"];
                            if(typeof inputFunc == "function"){
                                arr.push(inputFunc(item, self));
                                }
                        }
                        else if(item.nodeName === "TEXTAREA"){
                            var textAreaFunc = this["textAreaFunc"];
                            if(typeof textAreaFunc == "function"){
                                arr.push(textAreaFunc(item, self));
                                }
                        }
                    }
                    else{
                        classes.split(" ").forEach(val =>{
                            if(checker){
                                
                                if(val !== null && val !== ""){
                                    if(val.indexOf('-') > -1){
                                        var under = val.replace(/-/g, '_');
                                        var number = under.replace(/_/g, '');
                                        number = number.match(/[a-z]+|[^a-z]+/gi);
                                        number = number[number.length -1];
                                        under = under.split('_');
                                        var func = this[under[0]+'_'+under[1]];
                                        if(typeof func == "function"){
                                            if(number !== undefined){
                                                arr.push(func(number, item, self));
                                            }
                                            
                                        }
                                    }
                                    else{
                                        var func = this[val];
                                        if(typeof func == "function"){
                                            arr.push(func(item, self));
                                        }
                                    }
                                }
                            }
                            if(val == "validationChecker"){
                                checker = true;
                            }
                        })
                    }
                }
            })
            return arr;
    }

    /**
     * 
     * @param {*} item
     * @param self - references this
     * 
     */
    tl_min(num, item, self){
        if(item.value.length > num){
            item.classList.remove('error');
            self.showResult(item, "", "");
            return true;
        }
        else{
            self.classType = 'error';
            item.getAttribute('error-message') ? self.message = item.getAttribute('error-message') : self.message += " Text length must be greater than "+ num;
            self.showResult(item, self.message, self.classType);
            return false;
        }
    }

    /**
     * 
     * @param item 
     * @param self - reference this
     * 
     */
    tl_max(num, item, self){
        if(item.value.length < num){
            self.showResult(item, "", "");
            item.classList.remove('error');
            return true;
        }
        else{
            self.classType = 'error';
            item.getAttribute('error-message') ? self.message = item.getAttribute('error-message') : self.message += " Text length must be less than "+ num;
            self.showResult(item, self.message, self.classType);
            return false;
        }
    }

    /**
     * 
     * @param item
     * @param self
     * 
     */
    email(item, self){
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var test = re.test(item.value);
        if(!test){
            self.classType = 'error';
            item.getAttribute('error-message') ? self.message = item.getAttribute('error-message') : self.message = "Please enter a valid email address";
            self.showResult(item, self.message, self.classType);
            return false;
        }
        else{
            self.showResult(item, "", "");
            item.classList.remove('error');
            return true;
        }

    }

    /**
     * 
     * @param item
     * @param self
     * 
     */
    selectFunc(item, self){
        if(item.value == 0){
            item.getAttribute('error-message') ? self.message = item.getAttribute('error-message') : self.message = "Please Select an Option";
            self.showResult(item, self.message, "error");
            return false;
        }
        else{
            item.classList.remove('error');
            item.nextElementSibling.classList.remove('error');
            self.showResult(item, "", "");
            return true;
        }
    }

     /**
     * 
     * @param item
     * @param self
     * 
     */
    inputFunc(item, self){
        let type = item.getAttribute('type');
        if(type == "text"){
            if(item.value == ""){
                item.getAttribute('error-message') ? self.message = item.getAttribute('error-message') : self.message = "Please input information";
                self.showResult(item, self.message, "error");
                return false;
            }
            else{
                item.classList.remove('error');
                item.nextElementSibling.classList.remove('error');
                self.showResult(item, "", "");
                return true;
            }
        }
        else if(type == "checkbox"){
            if(item.checked == false){
                item.getAttribute('error-message') ? self.message = item.getAttribute('error-message') : self.message = "Please check the box";
                self.showResult(item, self.message, "error");
                return false;
            }
            else{
                item.classList.remove('error');
                item.nextElementSibling.classList.remove('error');
                self.showResult(item, "", "");
                return true;
            }
        }

    }

     /**
     * 
     * @param item
     * @param self
     * 
     */
    textAreaFunc(item, self){
        if(item.value == ""){
            item.getAttribute('error-message') ? self.message = item.getAttribute('error-message') : self.message = "Please input information into the text area";
            self.showResult(item, self.message, "error");
            return false;
        }
        else{
            item.classList.remove('error');
            self.showResult(item, "", "");
            item.nextElementSibling.classList.remove('error');
            return true;
        }
    }

    /**
     * 
     * @param HTMLCollection
     * 
     */
    findDependents(htmlCollection){
        var arr = [];
        for(let item of htmlCollection){
            if(item.getAttribute('dependent') !== "" && item.getAttribute('dependent') != undefined){
                arr.push(item.getAttribute('dependent'));
            }
        }
        return arr;
    }

}