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
                    digits: 20,
                    paramDigits: 4
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
        self.selectDiv = $('<div />').addClass('selectDiv').append('If X has a ');
        self.selectDist = $('<select />').change(function() {
              changeDist($(this).val());
        });

        // parameters of the distributions
        $.each(self.options['distributions'], function(i, v) {
               $('<option/>', { value : v[0] }).text(v[0]).appendTo(self.selectDist);
               self.distDivs[v[0]] = $('<div />').css('display','inline');
               $.each(v[1], function(j, parm) {
                     self.distDivs[v[0]].append(parm + ' = ')
                                        .append($('<input type="text" />').attr('size','paramDigits'))
                                        .append(', ');
               });
        })
 
         self.paramSpan = $('<span />').addClass('paramSpan');
         self.selectDiv.append(self.selectDist)
                      .append('distribution, with parameters ')
                      .append(self.paramSpan);
       
        // start with the first listed distribution
        self.paramSpan.append(self.distDivs[self.options['distributions'][0][0]]);

        // range over which to find the probability
        self.selectDiv.append(' the chance that ')
                      .append($('<input type="checkbox">').css('id','useLower').click(calcProb))
                      .append('X &ge;')
                      .append($('<input type="text" />').attr('size',self.options['digits']).val("0"))
                      .append($('<input type="checkbox">').css('id','useUpper').click(calcProb))
                      .append('and X &le;')
                      .append($('<input type="text" />').attr('size',self.options['digits']).val("0"))
                      .append(' is ');

        // display
        self.theDisplay = $('<input type="text" readonly />').attr('size',self.options['digits']);
        self.selectDiv.append(self.theDisplay);
        me.append(self.selectDiv);
    }
    init();

//  action functions

    function changeDist(dist) {
        self.currDist = dist;
        self.paramSpan.empty();
        var inx = $.grep(self.options['distributions'], function(i,v) {
                if(v[0] === dist) {
                  return(v);
                }
        });
        alert(inx);
        self.paramSpan.append(self.distDivs[inx[0]]);  // replace with parameters for current distribution
        calcProb();
    }

    function calcProb() {}

}
