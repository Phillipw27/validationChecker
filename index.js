let heights = [];
validator = (form) => {
    var inputs = form.getElementsByTagName('input');
    var select = form.getElementsByTagName('select');
    var textArea = form.getElementsByTagName('textarea');
    var newArr = [...inputs, ...select, ...textArea];
    let arr = [];


    newArr.forEach((item) => {
        var checker = false;
        var name = item.getAttribute('name');
        var classes = item.getAttribute('class');
        console.log(classes);
        if (classes) {
            var incoming = classes.split(" ");
            if (incoming[incoming.length - 1] == "validationChecker" || (incoming[incoming.length - 1] == "error" && incoming[incoming.length - 2] == "validationChecker")) {
                if (item.nodeName === "SELECT") {
                    var selectFunc = this["selectFunc"];
                    if (typeof selectFunc == "function") {
                        arr.push(selectFunc(item));
                    }
                }
                else if (item.nodeName === "INPUT") {
                    var inputFunc = this["inputFunc"];
                    if (typeof inputFunc == "function") {
                        arr.push(inputFunc(item));
                    }
                }
                else if (item.nodeName === "TEXTAREA") {
                    var textAreaFunc = this["textAreaFunc"];
                    if (typeof textAreaFunc == "function") {
                        arr.push(textAreaFunc(item));
                    }
                }
            }
            else {
                classes.split(" ").forEach(val => {
                    if (checker) {
                        if (val !== null && val !== "") {
                            if (val.indexOf('-') > -1) {
                                var under = val.replace(/-/g, '_');
                                var number = under.replace(/_/g, '');
                                number = number.match(/[a-z]+|[^a-z]+/gi);
                                number = number[number.length - 1];
                                under = under.split('_');
                                var func = this[under[0] + '_' + under[1]];
                                if (typeof func == "function") {
                                    if (number !== undefined) {
                                        arr.push(func(number, item, self));
                                    }

                                }
                            }
                            else {
                                var func = this[val];
                                if (typeof func == "function") {
                                    arr.push(func(item, self));
                                }
                            }
                        }
                    }
                    if (val == "validationChecker") {
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
 * @param from
 * @param num
 * @param {*} item 
 * 
 */
possiblyMore = (from, num, item) => {
    console.log(validator);
    if (from == 'tl-min') {
        if (item.value.length > num) {
            item.classList.remove('error');
            this.showResult(item, "", "");
            return true;
        }
        else {
            this.classType = 'error';
            item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message += " Text length must be greater than " + num;
            this.showResult(item, this.message, this.classType);
            this.error = true;
            console.log(item.getBoundingClientRect());
            heights.push(item.getBoundingClientRect().y);
            return false;
        }
    }
    if (from == 'tl-max' && !this.error) {
        if (item.value.length < num && item.value.length !== 0) {
            this.showResult(item, "", "");
            item.classList.remove('error');
            return true;
        }
        else {
            this.classType = 'error';
            item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message += " Text length must be less than " + num;
            this.showResult(item, this.message, this.classType);
            heights.push(item.getBoundingClientRect().y);
            return false;
        }
    }
}

/**
 * 
 * @param num
 * @param {*} item
 * @param self - references this
 * 
 */
tl_min = (num, item) => {
    console.log(num);
    console.log(item);
    this.possiblyMore('tl-min', num, item);
}


/**
 * 
 * @param num
 * @param item 
 * 
 */
tl_max = (num, item) => {
    console.log(num);
    console.log(item);
    this.possiblyMore('tl-max', num, item);
}

/**
 * @param item - actual input field
 * @param message - message to display
 * @param classtype - class name to add to the item 
 * 
 */
showResult = function (item, message, classtype) {
    if (!item.className.includes('error')) {
        item.className += ' ' + classtype;
    }
    item.nextElementSibling.innerHTML = message;
    if (!item.nextElementSibling.className.includes('error')) {
        item.nextElementSibling.className += ' ' + classtype;
    }
    return true;
}

/**
 * 
 * @param item
 * 
 */
email = (item) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var test = re.test(item.value);
    if (!test) {
        this.classType = 'error';
        item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message = "Please enter a valid email address";
        this.showResult(item, this.message, this.classType);
        heights.push(item.getBoundingClientRect().y);
        return false;
    }
    else {
        this.showResult(item, "", "");
        item.classList.remove('error');
        return true;
    }

}

/**
 * 
 * @param item
 * 
 */
selectFunc = (item) => {
    if (item.value == 0) {
        item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message = "Please Select an Option";
        this.showResult(item, this.message, "error");
        heights.push(item.getBoundingClientRect().y);
        return false;
    }
    else {
        item.classList.remove('error');
        item.nextElementSibling.classList.remove('error');
        this.showResult(item, "", "");
        return true;
    }
}

/**
* 
* @param item
* @param self
* 
*/
inputFunc = (item) => {
    let type = item.getAttribute('type');
    if (type == "text") {
        if (item.value == "") {
            item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message = "Please input information";
            this.showResult(item, this.message, "error");
            heights.push(item.getBoundingClientRect().y);
            return false;
        }
        else {
            item.classList.remove('error');
            item.nextElementSibling.classList.remove('error');
            this.showResult(item, "", "");
            return true;
        }
    }
    else if (type == "checkbox") {
        if (item.checked == false) {
            item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message = "Please check the box";
            this.showResult(item, this.message, "error");
            heights.push(item.getBoundingClientRect().y);
            return false;
        }
        else {
            item.classList.remove('error');
            item.nextElementSibling.classList.remove('error');
            this.showResult(item, "", "");
            return true;
        }
    }

}

/**
* 
* param item
* 
*/
textAreaFunc = (item) => {
    if (item.value == "") {
        item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message = "Please input information into the text area";
        this.showResult(item, this.message, "error");
        heights.push(item.getBoundingClientRect().y);
        return false;
    }
    else {
        item.classList.remove('error');
        this.showResult(item, "", "");
        item.nextElementSibling.classList.remove('error');
        return true;
    }
}



this.onload = (event) => {
    let form = this.document.getElementById('validationCheck');
    if (form.length > 0) {
        form.addEventListener('submit', function (e) {
            let value = validator(form);
            if (value.includes(false)) {
                e.preventDefault();
                window.scrollTo({
                    top: ((window.document.body.clientHeight - Math.abs(Math.min(...heights)) - window.innerHeight) - 350),
                    behavior: 'smooth',
                });
            }
            else {
                return true;
            }

        });


    }
}


