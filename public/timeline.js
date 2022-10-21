import { getUserData, updateMilestones, updateCategories } from './firebase.js';

let currentImageSource = '';

let categories = [];
let milestones = [];

// ---------- LOADING SCREEN ----------

setTimeout(() => {
    $(document).ready(() => {
        $('#loading-screen').css({'display': 'none'});
    });
}, 1500);

// ---------- ADDING MILESTONES ----------

export async function displayMilestones()
{
    let data = await getUserData();
    milestones = data.milestones;
    categories = data.categories;

    let parent = $('#milestones');
    parent.html('');

    if (data.milestones.length == 0) $('#milestones-empty').css({'display': 'flex'});
    else $('#milestones-empty').css({'display': 'none'});

    data.milestones.forEach(element => {

        let categoryHTML = '';

        element.categories.forEach(category => {
            categoryHTML += `<div class="category">
            <p>${category.emoji}</p>
            <h3>${category.title}</h3>
        </div>`;
        });

        if (element.layout == 'text') {
            parent.html(parent.html() + `
            <div class="milestone text-milestone">

                <button class="primary-button delete-milestone">
                    &times;
                </button>

                <div class="milestone-text">

                    <h2>${element.title}</h2>

                    <div class="milestone-categories">${categoryHTML}</div>

                    <p class="description">${element.description}</p>

                </div>
                
            </div>
            `);
        }

        else if (element.layout == 'picture') {
            parent.html(parent.html() + `
            <div class="milestone picture-milestone">

                <button class="primary-button delete-milestone">
                &times;
                </button>

                <img src="${element.imageSource}" alt="milestone-text" />
                <div class="milestone-text">

                    <h2>${element.title}</h2>

                    <div class="milestone-categories">${categoryHTML}</div>
                </div>
                
            </div>
            `);
        }

        else if (element.layout == 'picture-text') {
            parent.html(parent.html() + `
            <div class="milestone picture-text-milestone">

                <button class="primary-button delete-milestone">
                &times;
                </button>

                <img src="${element.imageSource}" alt="milestone-text" />
                <div class="milestone-text">

                    <h2>${element.title}</h2>

                    <div class="milestone-categories">${categoryHTML}</div>

                    <p class="description">${element.description}</p>

                </div>
                
            </div>
            `);
        }
        
    });

    $('.delete-milestone').click(handleDeleteMilestone);
}

function addMilestone()
{
    let title = $('#title').val();
    let date = {
        day: $('#date').val().slice(5, 7),
        month: $('#date').val().slice(8, 10),
        year: $('#date').val().slice(0, 4)
    }
    let layout = $('input[name="layout"]:checked').val();
    let description = $('#description').val();
    
    let imageSource = '';
    if (layout != 'text') imageSource = currentImageSource;
    console.log(imageSource);

    let categories = $('#categories .checkbox').toArray();
    let newCategories = [];

    categories.forEach(category => {
        if ($(category).hasClass('checkbox-checked'))
        {
            newCategories.push({
                emoji: $(category).children('p').text(),
                title: $(category).children('h3').text()
            });
        }
    });

    milestones.push({
        title: title,
        date: date,
        categories: newCategories,
        layout: layout,
        description: description,
        imageSource: imageSource
    });

    updateMilestones(milestones);
    displayMilestones();
}

function handleDeleteMilestone(event)
{
    let target = $(event.target).parent();
    let title = target.children('.milestone-text').children('h2').text();

    let response = prompt(`Type "delete" to remove "${title}"`, "");

    if (response.toLowerCase() == 'delete') removeMilestone(title);
}

function removeMilestone(title)
{
    let newMilestones = [];

    milestones.forEach(value => {
        if (value.title != title) newMilestones.push(value);
    });

    updateMilestones(newMilestones);
    setTimeout(displayMilestones, 500);
}

$('#logout-button').click(clearMilestones);

function clearMilestones()
{
    let parent = $('#milestones');
    parent.html('');
}

// ---------- CHECKBOX & RADIO CSS ----------

function initializeCSS()
{
    $('.checkbox').on('mouseup', event => {
        let target = $(event.target);
        if (event.target.nodeName != 'LABEL') target = $(event.target).parent();
    
        if (!target.children('input').is(':checked'))
        {
            target.addClass('checkbox-checked');
        }
    
        else
        {
            target.removeClass('checkbox-checked');
        }
    });
    
    $('.radio').on('mouseup', event => {
        let target = $(event.target);
        if (event.target.nodeName != 'LABEL') target = $(event.target).parent();
    
        $('.radio').each((index, value) => {
            if ($(value).children('input').attr('name') == target.children('input').attr('name')) $(value).removeClass('radio-checked');
        });
    
        if (!target.children('input').is(':checked'))
        {
            target.addClass('radio-checked');
        }
    });
}

initializeCSS();

// ---------- POPUP ----------
let popupShowing = false;

$('#add-button').click(() => {    
    if ($('#profile-button').css('display') == 'none') togglePopupForms('#login-form');
    else togglePopupForms('#add-milestone');
});

$('#exit-popup').click(() => {togglePopupForms('#add-milestone')});
$('#register-button').click(() => {togglePopupForms('#register-form')});
$('#register-link').click(() => {switchPopupForms('#login-form')});
$('#login-button').click(() => {togglePopupForms('#login-form')});
$('#login-link').click(() => {switchPopupForms('#register-form')});
$('#exit-login').click(togglePopup);
//$('#shader').click(removePopup);

function togglePopup()
{
    $('#add-milestone').css({'display': 'none'});
    $('#login').css({'display': 'none'});
    $('#login-form').css({'display': 'none'});
    $('#register-form').css({'display': 'none'});

    if (!editCategoriesShown) toggleCategory();
    fillInCategories(categories);

    if (popupShowing)
    {
        $('#shader').css({'background-color': 'rgba(0, 0, 0, 0)'});
        setTimeout(() => {
            $('#shader').css({'display': 'none'});
            clearForm();
        }, 200);
    }

    else
    {
        $('#shader').css({'display': 'flex'});
        setTimeout(() => {
            $('#shader').css({'background-color': 'rgba(0, 0, 0, 0.5)'});
        }, 1);
    }

    popupShowing = !popupShowing;
}

function removePopup(event)
{
    if ($(event.target).attr('id') != 'shader') return;
    if (!editCategoriesShown) toggleCategory();

    $('#add-milestone').css({'display': 'none'});
    $('#login').css({'display': 'none'});
    $('#login-form').css({'display': 'none'});
    $('#register-form').css({'display': 'none'});
    
    $('#shader').css({'background-color': 'rgba(0, 0, 0, 0)'});
    setTimeout(() => {
        $('#shader').css({'display': 'none'});
        clearForm();
    }, 200);

    popupShowing = false;
}

// FORM ID must be either '#add-milestone' or '#login-form' or '#register-form'
function togglePopupForms(formId)
{
    togglePopup();

    if (formId != '#login-form' && formId != '#register-form') $(formId).css({'display': 'block'});
    else
    {
        $('#login').css({'display': 'block'});
        $(formId).css({'display': 'flex'});
    }
}

function switchPopupForms(formId)
{
    $('#add-milestone').css({'display': 'none'});
    $('#login').css({'display': 'none'});
    $('#login-form').css({'display': 'none'});
    $('#register-form').css({'display': 'none'});

    if (formId != '#login-form' && formId != '#register-form') $(formId).css({'display': 'block'});
    else
    {
        $('#login').css({'display': 'block'});
        $(formId).css({'display': 'flex'});
    }
}

// ---------- ADD MILESTONE FORM ----------

// PAGE ONE
function fillInCategories(categoryList)
{
    let parent = $('#categories');
    parent.html('');

    categoryList.forEach(element => {
        parent.html(parent.html() + `
        <label for="${element.title}" class="checkbox">
            <input type="checkbox" id="${element.title}">
            <p>${element.emoji}</p>
            <h3>${element.title}</h3>
        </label>
        `);
    });

    parent.html(parent.html() + `
    <a href="#" id="add-category" class="primary-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
    </a>
    `);

    $('#add-category').click(toggleCategory);
    initializeCSS();
}

function changePages(page) {
    let pageOne = $('#form-1');
    let pageTwo = $('#form-2');

    if (page == 2) {
        if (!editCategoriesShown) toggleCategory();

        pageOne.css({'transform': 'translateX(-650px)'});
        pageTwo.css({'transform': 'translateY(-550px) translateX(0px)'});
        $('#form-submit').text('Add Milestone');
    }

    else if (page == 1) {
        pageOne.css({'transform': 'translateX(0px)'});
        pageTwo.css({'transform': 'translateY(-550px) translateX(650px)'});
        $('#form-submit').text('Next');
    }
}

function handlePageChange() {
    let form1 = $('#form-1');
    form1.validate();

    if (form1.valid()) {
        $('#form-page-1').css({'background-color': 'var(--highlightColor)'});
        changePages(2);
    }
}

function handleSubmit(event) {
    if ($(event.target).text() == 'Next')
    {
        let title = $('#title').val();
        let date = new Date($('#date').val());
        let categories = $('input[name="categories"]:checked').val();
        let layout = $('input[name="layout"]:checked').val();

        if (layout == 'picture')
        {
            $('#description').css({'display': 'none'});
            $('#upload-image').css({'display': 'flex', 'height': '250px'});
        }

        else if (layout == 'text') {
            $('#description').css({'display': 'block', 'min-height': '400px', 'max-height': '400px'});
            $('#upload-image').css({'display': 'none'});
        }

        else if (layout == 'picture-text') {
            $('#description').css({'display': 'block', 'min-height': '150px', 'max-height': '150px'});
            $('#upload-image').css({'display': 'flex', 'height': '200px'});
        }

        else console.log('ERROR');

        handlePageChange();
    }

    else {
        let form2 = $('#form-2');
        form2.validate();

        if (form2.valid()) {
            //$('#form-page-2').css({'background-color': 'var(--highlightColor)'});
            addMilestone();
            togglePopup();
        }
    }
}

$('#form-submit').click(handleSubmit);
$('#form-page-1').click(() => {
    changePages(1);
});
$('#form-page-2').click(handlePageChange);

function clearForm()
{
    changePages(1);
    $('#form-page-1').css({'background-color': 'lightgray'});

    // Clear Page One
    $('#title').val('');
    $('#date').val('');

    $('.radio').each((index, value) => {
        if ($(value).children('input').attr('name') == 'layout')
        {
            $(value).prop("checked", false);
            $(value).removeClass('radio-checked');
        }
    });

    $('#picture-text').prop("checked", true);
    $('#picture-text').parent().addClass('radio-checked');

    // Clear Page Two
    $('#description').val('');

    let preview = $('#preview');
    preview.attr('src', '#');
    preview.css({'display': 'none'});
    $('#image-preview p').css({'display': 'block'});

    $('#image-dropper').val('');

}

// PAGE TWO
function showPreview() {
    let src = $('#image-dropper').val();
    let preview = $('#preview');
    currentImageSource = src;
    preview.attr('src', src);
    preview.css({'display': 'block'});
    $('#image-preview p').css({'display': 'none'});
}

/*
function showPreview(event) {
    if (event.target.files.length > 0) {
        let src = URL.createObjectURL(event.target.files[0]);
        let preview = $('#preview');
        currentImageSource = src;
        preview.attr('src', src);
        preview.css({'display': 'block'});
        $('#image-preview p').css({'display': 'none'});
    }
}
*/

function StopDefaultBehavior(event)
{
    event.preventDefault();
    event.stopPropagation();
}

$('#image-dropper').on('input', showPreview);

// ---------- ADD CATEGORY FORM ----------
let editCategoriesShown = true;

$('#save-categories').click(saveCategories);

function fillInInputs(categoryList)
{
    let inputs = $('.category-name');

    inputs.each((index, value) =>
    {
        if (categoryList.length > index) value.value = categoryList[index].title;
    });
}

function fillInEmojis(categoryList)
{
    let emojis = $('.emoji-button');

    emojis.each((index, value) =>
    {
        if (categoryList.length > index) value.innerText = categoryList[index].emoji;
    });
}

function saveCategories()
{
    let newCategories = [];

    let inputs = $('.category-name');
    let emojis = $('.emoji-button');

    inputs.each((index, value) => {
        if (value.value != '')
        {
            newCategories.push({
                title: value.value,
                emoji: emojis[index].innerText
            });
        }
    });

    categories = newCategories;
    updateCategories(categories);
    fillInCategories(categories);
    toggleCategory();
}

async function toggleCategory()
{
    // Fill in inputs with categories
    fillInInputs(categories);
    fillInEmojis(categories);

    if (!editCategoriesShown) $('#edit-categories').css({'transform': 'translateX(300px)'});
    else $('#edit-categories').css({'transform': 'translateX(0px)'});

    editCategoriesShown = !editCategoriesShown;
}

// Emoji Picker Initialization
let pickers = [new EmojiButton(), new EmojiButton(), new EmojiButton(), new EmojiButton(), new EmojiButton(), new EmojiButton(), new EmojiButton(), new EmojiButton(), new EmojiButton(), new EmojiButton()];

function initializeEmojiPicker(pickerList)
{
    let emojiButtons = $('.emoji-button');

    emojiButtons.each((index, value) =>
    {
        pickers[index] = new EmojiButton();

        $(value).click(() => {
            pickers[index].togglePicker(value);
        });

        pickers[index].on('emoji', emoji => {
            value.innerText = emoji;
        });
    });
}

initializeEmojiPicker(pickers);

// ---------- MEDIA QUERY CHANGES ----------

$('#menu-button').click(() => {
    if ($('#middle-nav').css('height') == '150px')
    {
        $('#middle-nav').css({'height': '0px'});
        setTimeout(() => {
            $('#middle-nav').css({'display': 'none'});
        }, 250);
    }

    else {
        $('#middle-nav').css({'display': 'flex'});
        $('#middle-nav').css({'height': '150px'});
    }
});

// ---------- SLIDESHOW FORM ----------
$('#exit-slideshow-settings').click(toggleSlideshowSettings);
$('#slideshow-button').click(toggleSlideshowSettings);
$('#slideshow-nav-button').click(toggleSlideshowSettings);

$('#slideshow-settings').css({'transform': 'scale(0)'});

let slideshowSettingsShowing = false;

function toggleSlideshowSettings() {
    if (slideshowSettingsShowing == false) {
        if ($('#profile-button').css('display') == 'none') {
            togglePopupForms('#login-form');
            return;
        }

        $('#slideshow-settings').css({'transform': 'scale(1)'});
        slideshowSettingsShowing = true;
    }

    else {
        $('#slideshow-settings').css({'transform': 'scale(0)'});
        slideshowSettingsShowing = false;
    }
}

// ---------- SLIDESHOW ASSEMBLY ----------

let autoplayIntervalId = '';

$('#slideshow-submit').click(event => {
    StopDefaultBehavior(event);
    displaySlideshow();
});

$('#exit-slideshow').click(event => {
    $('#slideshow').css({'left': '100vw'});
    $('#exit-slideshow').css({'display': 'none'});
    $('#audio-player')[0].pause();
});

async function displaySlideshow()
{
    $('#slideshow-settings form').validate();

    if (!$('#slideshow-settings form').valid()) return;

    setTimeout(() => {
        $('#exit-slideshow').css({'display': 'flex'});
    }, 400);

    toggleSlideshowSettings();

    let data = await getUserData();
    milestones = data.milestones;
    categories = data.categories;

    $('#slideshow').css({'left': '0'});

    let parent = $('#slideshow-container');
    parent.html('');
    $('#slideshow-container').css({'margin-left': '0'});

    if (data.milestones.length == 0)
    {
        alert('You must have at least one milestone to make a slideshow.');
        return;
    }

    let color = $('input[name="color"]:checked').val();

    data.milestones.forEach(element => {

        let categoryHTML = '';

        element.categories.forEach(category => {
            categoryHTML += `<div class="category">
            <p>${category.emoji}</p>
            <h3>${category.title}</h3>
        </div>`;
        });

        if (element.layout == 'text') {
            parent.html(parent.html() + `
            <div class="slide text-slide" style="background-color: ${color};">

                <div class="slide-text">

                    <h1 class="slide-title">
                        ${element.title}
                        <span class="slide-date">${element.date.month + '/' + element.date.day + '/' + element.date.year}</span>
                    </h1>

                    <p class="slide-description">
                        ${element.description}
                    </p>

                    <div class="slide-categories">
                        ${categoryHTML}
                    </div>

                </div>

            </div>
            `);
        }

        else if (element.layout == 'picture') {
            parent.html(parent.html() + `
            <div class="slide picture-slide" style="background-image: url(${element.imageSource});">

                <div class="slide-text">

                    <h1 class="slide-title">
                        ${element.title}
                        <span class="slide-date">${element.date.month + '/' + element.date.day + '/' + element.date.year}</span>
                    </h1>

                    <div class="slide-categories">
                        ${categoryHTML}
                    </div>

                </div>

            </div>
            `);
        }

        else if (element.layout == 'picture-text') {
            parent.html(parent.html() + `
            <div class="slide picture-text-slide" style="background-image: url(${element.imageSource});">

                <div class="slide-text">

                    <h1 class="slide-title">
                        ${element.title}
                        <span class="slide-date">${element.date.month + '/' + element.date.day + '/' + element.date.year}</span>
                    </h1>

                    <p class="slide-description">
                        ${element.description}
                    </p>

                    <div class="slide-categories">
                        ${categoryHTML}
                    </div>

                </div>

            </div>
            `);
        }
    });

    let music = $('input[name="music"]:checked').val();
    $('#audio-player').attr('src', music);
    $('#audio-player')[0].play();

    autoplaySlideshow($('#delay').val() * 1000);
}

function autoplaySlideshow(delay) {
    let slides = $('.slide').length;
    let currentSlide = 1;

    clearInterval(autoplayIntervalId);

    autoplayIntervalId = setInterval(() => {
        if (currentSlide >= slides) currentSlide = 0;

        $('#slideshow-container').css({'margin-left': -100 * currentSlide + 'vw'});
        currentSlide++;
    }, delay);
}

// ---------- HELP ----------

$('#resume-button').click();
$('#help-nav-button').click(showHelp);

$('#exit-help').click(event => {
    $('#help').css({'left': '-100vw'});
    $('#exit-help').css({'display': 'none'});
});

function showHelp() {
    $('#help').css({'left': '0'});

    setTimeout(() => {
        $('#exit-help').css({'display': 'flex'});
    }, 400);
}

// ---------- RESUME ----------

$('#resume-button').click(showResume);
$('#print-resume').click(printResume);

$('#exit-resume').click(event => {
    $('#resume').css({'right': '-100vw'});
    $('#exit-resume').css({'display': 'none'});
    $('#print-resume').css({'display': 'none'});
});

function showResume() {
    displayResume();
    $('#resume').css({'right': '0'});

    setTimeout(() => {
        $('#exit-resume').css({'display': 'flex'});
        $('#print-resume').css({'display': 'flex'});
    }, 400);
}

async function displayResume()
{
    let data = await getUserData();

    let parent = $('#resume-milestones');
    parent.html('');

    if (data.milestones.length == 0)
    {
        alert("You must have at least one milestone to continue");
        return;
    }

    data.milestones.forEach(element => {

        let categoryHTML = '';

        element.categories.forEach(category => {
            categoryHTML += `<div class="category">
            <p>${category.emoji}</p>
            <h3>${category.title}</h3>
        </div>`;
        });

        if (element.layout == 'text') {
            parent.html(parent.html() + `
            <div class="milestone text-milestone">

                <div class="milestone-text">

                    <h2>${element.title}</h2>

                    <div class="milestone-categories">${categoryHTML}</div>

                    <p class="description">${element.description}</p>

                </div>
                
            </div>
            `);
        }

        else if (element.layout == 'picture') {
            parent.html(parent.html() + `
            <div class="milestone picture-milestone">

                <img src="${element.imageSource}" alt="milestone-text" />
                <div class="milestone-text">

                    <h2>${element.title}</h2>

                    <div class="milestone-categories">${categoryHTML}</div>
                </div>
                
            </div>
            `);
        }

        else if (element.layout == 'picture-text') {
            parent.html(parent.html() + `
            <div class="milestone picture-text-milestone">

                <img src="${element.imageSource}" alt="milestone-text" />
                <div class="milestone-text">

                    <h2>${element.title}</h2>

                    <div class="milestone-categories">${categoryHTML}</div>

                    <p class="description">${element.description}</p>

                </div>
                
            </div>
            `);
        }
        
    });
}

function printResume() {
    $('#resume').css({'padding': '0'});
    $('#resume section').css({'width': '100%', 'margin-left': '0', 'border-radius': '0px'});
    $('#exit-resume').css({'display': 'none'});
    $('#print-resume').css({'display': 'none'});
    print();
    $('#resume').css({'padding': '50px 0px'});
    $('#resume section').css({'width': '850px', 'margin-left': 'calc(50% - 425px)', 'border-radius': 'var(--secondaryBorderRadius)'});
    $('#exit-resume').css({'display': 'flex'});
    $('#print-resume').css({'display': 'flex'});
}

/*

---------- BUG LIST ----------
1. Date input in form isn't required
2. Too many categories makes form look bad
3. File drag and drop doesn't work
4. CSS doesn't always align with radio inputs (when clicked, box becomes unchecked)
5. Sometimes pressing emoji button in category editor causes popup to toggle off
6. Have to press buttons (#add-milestone, #login-button, #register-button) twice after changing login/logout status

*/