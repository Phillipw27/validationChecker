let heights = [];
function validator(form){
    var inputs = form.getElementsByTagName('input');
    var select = form.getElementsByTagName('select');
    var textArea = form.getElementsByTagName('textarea');
    var newArr = [...inputs, ...select, ...textArea];
    let arr = [];


    newArr.forEach((item) => {
        var name = item.getAttribute('name');
        var classes = item.getAttribute('class');

        if (classes !== null) {
            classes = classes.split(" ");
            if(classes.includes('validationChecker')){
                if (item.nodeName === "SELECT") {
                    var selectFunc = this["selectFunc"];
                    if (typeof selectFunc == "function"){
                        arr.push(selectFunc(item));
                    }
                }
                else if (item.nodeName === "INPUT") {
                    let tlmin = classes.findIndex(element => element.includes("tl-min"));
                    let tlmax = classes.findIndex(element => element.includes("tl-max"));
                    if(item.type == 'email'){
                        arr.push(email(item));
                    }
                    else if (tlmin > 0 || tlmax > 0) {
                        if (tlmin >= 0 && tlmax >= 0) {
                            arr.push(tl_min_and_max(classes[tlmin].split("-")[2], item, classes[tlmax].split("-")[2]));
                        }
                        else if(tlmin >= 0){
                            arr.push(tl_min(classes[tlmin].split("-")[2], item));
                        }
                        else if (tlmax >= 0) {
                            arr.push(tl_max(classes[tlmax].split("-")[2], item));
                        }
                    }
                    else {
                        var inputFunc = this["inputFunc"];
                        if (typeof inputFunc == "function") {
                            arr.push(inputFunc(item));
                        }
                    }
    
                }
                else if (item.nodeName === "TEXTAREA") {
                    var textAreaFunc = this["textAreaFunc"];
                    if (typeof textAreaFunc == "function") {
                        arr.push(textAreaFunc(item));
                    }
                }
            }
            
        }
    });
    return arr;
}

/**
 * 
 * @param from
 * @param num
 * @param {*} item 
 * @param max (null or max number in tl-min & tl-max)
 * 
 */
possiblyMore = (from, num, item, max = null) => {
    if (from == 'tl-min') {
        if (item.value.length >= num) {
            item.classList.remove('error');
            this.showResult(item, "", "");
            return true;
        }
        else {
            this.classType = 'error';
            item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message = " Text length must be greater than " + num;
            this.showResult(item, this.message, this.classType);
            this.error = true;
            heights.push(item.getBoundingClientRect().y);
            return false;
        }
    }
    if (from == 'tl-max') {
        if (item.value.length < num && item.value.length !== 0) {
            this.showResult(item, "", "");
            item.classList.remove('error');
            return true;
        }
        else {
            this.classType = 'error';
            item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message = " Text length must be less than " + num;
            this.showResult(item, this.message, this.classType);
            heights.push(item.getBoundingClientRect().y);
            return false;
        }
    }
    if(from == 'tl-min-max'){
        if(item.value.length >= num && item.value.length <= max){
            this.showResult(item, "", "");
            item.classList.remove('error');
            return true;
        }
        else{
            this.classType = 'error';
            item.getAttribute('error-message') ? this.message = item.getAttribute('error-message') : this.message = " Text length must be greater than " + num + " and less than " + max;
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
    return this.possiblyMore('tl-min', num, item);
}


/**
 * 
 * @param num
 * @param item 
 * 
 */
tl_max = (num, item) => {
   return this.possiblyMore('tl-max', num, item);
}

/**
 * 
 * @param num
 * @param item
 * 
 */
tl_min_and_max = (min, item, max) =>{
    return this.possiblyMore('tl-min-max', min, item, max);
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
                //coming soon
                // window.scrollTo({
                //     top: ((window.document.body.clientHeight - Math.abs(Math.min(...heights)) - window.innerHeight) - 350),
                //     behavior: 'smooth',
                // });
            }
            else {
                return true;
            }

        });
    }
}


