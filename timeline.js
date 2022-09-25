let categories = [{
    title: 'Celebration',
    emoji: '🎉'
}, {
    title: 'Holiday',
    emoji: '🎃'
}, {
    title: 'Activity',
    emoji: '🎪'
}, {
    title: 'School Related',
    emoji: '🏫'
}]

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

$('#add-button').click(togglePopup);
$('#exit-popup').click(togglePopup);
$('#shader').click(removePopup)

function togglePopup()
{
    if (!editCategoriesShown) toggleCategory();
    fillInCategories(categories);

    if (popupShowing)
    {
        $('#shader').css({'background-color': 'rgba(0, 0, 0, 0)'});
        setTimeout(() => {
            $('#shader').css({'display': 'none'});
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
    
    $('#shader').css({'background-color': 'rgba(0, 0, 0, 0)'});
    setTimeout(() => {
        $('#shader').css({'display': 'none'});
    }, 200);

    popupShowing = false;
}

// ---------- ADD MILESTONE FORM ----------

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

function showPreview(event) {
    if (event.target.files.length > 0) {
        let src = URL.createObjectURL(event.target.files[0]);
        let preview = $('#preview');
        preview.attr('src', src);
        preview.css({'display': 'block'});
        $('#image-preview p').css({'display': 'none'});
    }
}

function StopDefaultBehavior(event)
{
    event.preventDefault();
    event.stopPropagation();
}

function showPreviewDrag(event)
{
    StopDefaultBehavior(event);
    console.log(event.dataTransfer);

    if (event.dataTransfer.files.length > 0) {
        let src = URL.createObjectURL(event.dataTransfer.files[0]);
        let preview = $('#preview');
        preview.attr('src', src);
        preview.css({'display': 'block'});
        $('#image-preview p').css({'display': 'none'});
    }
}

$('#image-dropper').on('change', showPreview);
$('#image-dropper').on('dragleave', StopDefaultBehavior);
$('#image-dropper').on('dragenter', StopDefaultBehavior);
$('#image-dropper').on('dragover', StopDefaultBehavior);
$('#image-dropper').on('drop', showPreviewDrag);

// ---------- ADD CATEGORY FORM ----------
let editCategoriesShown = true;

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

function toggleCategory()
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