/*
Calculator for probability distributions

copyright (c) 2013 by P.B. Stark
License: AGPL

Dependencies: irGrade,js, jQuery, jQuery-ui

*/

function probCalc(container_id, params) {
    var self = this;
    this.container = $('#' + container_id);

    if (!params instanceof Object) {
       console.error('probCalc parameters should be an object');
       return;
    }

// default options
    this.options = {
                    distributions: [ ["Binomial", ["n","p"]],
                                     ["Geometric", ["p"]],
                                     ["Negative Binomial", ["p","r"]],
                                     ["Hypergeometric",["N","G","n"]],
                                     ["Normal", ["mean","SD"]],
                                     ["Student t", ["degrees of freedom"]],
                                     ["Chi-square", ["degrees of freedom"]],
                                     ["Exponential", ["mean"]],
                                     ["Poisson", ["mean"]]
                                   ],
                    digits: 20
    };

// Extend options
    $.extend(this.options, params);

    self.lo = 0.0;
    self.hi = 0.0;
    self.currDist = null;
    self.distDivs = new Array();

    function init() {
        var me = $('<div />').addClass('probCalc');
        self.container.append(me);
        // distribution selection
        self.selectDist = $('<select />').change(function() {
              alert($(this).val());
              changeDist($(this).val());
        });
        me.append(self.selectDist);
        self.distDiv = $('<div />').addClass('distDiv');
        me.append(self.distDiv);
        $.each(self.options['distributions'], function(i, v) {
               $('<option/>', { value : v[0] }).text(v[0]).appendTo(self.selectDist);
               self.distDivs[v[0]] = $('<div />');
               $.each(v[1], function(j, parm) {
                     self.distDivs[v[0]].append('<input type="text" readonly />').attr('size','parmDigits');
                     self.distDivs[v[0]].after(parm);
               });
        })
        self.distDiv.append(self.distDivs[self.options['distributions'][0][0]]);
        // display
        self.theDisplay = $('<input type="text" readonly />').attr('size',self.options['digits']);
        me.append(self.theDisplay);
    }
    init();

//  action functions

    function changeDist(dist) {
        self.currDist = dist;
        self.distDiv.empty();
        self.distDiv.append(self.distDivs[dist]);
        calcProb();
    }

    function calcProb() {}

}
