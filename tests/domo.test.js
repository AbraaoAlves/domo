///<reference path="libs/jquery.js" />
///<reference path="libs/jasmine.js" />
///<reference path="libs/jasmine-html.js" />
///<reference path="libs/jasmine-jquery.js" />

///<reference path="../jquery-domo.js" />


describe("dado um nodeElement", function () {

    beforeEach(function () {
        
        setFixtures('<div name="Pessoa">' +
                        '<input type="text" name="Nome" value="Abraao">' +
                    '</div>');
    });

    it("quando setar um objeto com domo o DOM deve ser alterado", function () {
        var $context = $('div[name="Pessoa"]').parent();
        
        $context.domo({ Pessoa: { Nome: 'Joao' } });
        expect($('[name="Pessoa"] [name="Nome"]')).toHaveValue('Joao');

    });
    
});
