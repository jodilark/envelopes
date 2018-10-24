angular.module('billbo').factory('envelopeFactory', envelopeFactory);
function envelopeFactory($q, balances, store){
    var envelopes = store.data.envelopes, $scope, $rootScope;

    class Envelope{
        constructor(envObj){
            this.titleValue = envObj.title;
            this.amountValue = 0.00;
            this.visible = true;
            this.color = {
                r: Math.floor(Math.random() * Math.floor(255)),
                g: Math.floor(Math.random() * Math.floor(255)),
                b: Math.floor(Math.random() * Math.floor(255))
            };
            this.id = getRandomInt(0, 9999999).toString();
        }

        formData(){
            return this;
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
      }

    function getEnvelopes(){
        return $q.resolve(envelopes);
    }

    function createEnvelope(data, form){
        envelopes.push(new Envelope(data)); 
        document.getElementById(form).reset();
        return $q.resolve(envelopes);
    }

    function updateEnvelope(data){
        var valueFrom = Number(data.value.from),
        fromEnvelopeIndex = _.indexOf(envelopes, data.fromEnvelope),
        toEnvelopeIndex = _.indexOf(envelopes, data.toEnvelope),
        newFromBalance = envelopes[fromEnvelopeIndex].amountValue - valueFrom,
        newToBalance;
        if(toEnvelopeIndex > -1){
            newToBalance = envelopes[toEnvelopeIndex].amountValue + valueFrom;
        }
        if(fromEnvelopeIndex === 0){
            balances.update(valueFrom, 'subtract');
            originalMasterBalance = balances.getBalance();
        }
        if(toEnvelopeIndex === 0){
            balances.update(valueFrom, 'add');
            originalMasterBalance = balances.getBalance();
        }
        envelopes[fromEnvelopeIndex].amountValue = newFromBalance;
        if(toEnvelopeIndex > -1){
            envelopes[toEnvelopeIndex].amountValue = newToBalance;
        }
    }
    
    function deleteEnvelope(data){
        var elist;
        getEnvelopes().then(res => {
            elist = res;
            var envelopeToDelete = _.indexOf(elist, data);
            if(data.titleValue !== 'Master Balance' && elist.length >= 1){
                balances.update(elist[envelopeToDelete].amountValue, 'add');
            }
            $rootScope.$broadcast('closeModal');
            elist.splice(envelopeToDelete,1);
        });
    }

    function passScope(obj){
        $scope = obj;
        $rootScope = $scope.$root;
    }

    return {
        getEnvelopes:getEnvelopes,
        createEnvelope:createEnvelope,
        updateEnvelope:updateEnvelope,
        deleteEnvelope: deleteEnvelope,
        passScope: passScope
    }

}