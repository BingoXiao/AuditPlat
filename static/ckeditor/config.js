/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {

    // Remove some buttons provided by the standard plugins, which are
    config.language = 'zh-cn';

    // Set the most common block elements.
    config.format_tags = 'p';

    //图片处理
    config.pasteFromWordRemoveStyles = true;
    config.filebrowserImageUploadUrl = "/register/upload-tmpimage/";

    //是否使用HTML实体进行输出 plugins/entities/plugin.js
    config.entities = false;

    //系统公告
    config.toolbar_MyToolbar =
        [
            ['Undo', 'Redo', '-', 'Copy']
        ];


    //项目列表 脉点
    config.toolbar = 'Full';
    config.toolbar_Full =
        [
            {
                name: 'document',
                items: ['Source', '-', 'Save', 'NewPage', 'DocProps', 'Preview', 'Print', '-', 'Templates']
            },
            {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
            {name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker', 'Scayt']},
            {
                name: 'forms',
                items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton',
                    'HiddenField']
            },
            '|',
            {
                name: 'basicstyles',
                items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
            },
            {
                name: 'paragraph',
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',
                    '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
            },
            {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
            {
                name: 'insert',
                items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']
            },
            '|',
            {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
            {name: 'colors', items: ['TextColor', 'BGColor']},
            {name: 'tools', items: ['Maximize', 'ShowBlocks', '-', 'About']}
        ];


    //编辑器中回车产生的标签
    config.enterMode = CKEDITOR.ENTER_BR;
};
