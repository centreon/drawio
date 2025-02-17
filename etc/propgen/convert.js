const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const bidiFactory = require('bidi-js');
const bidi = bidiFactory();
const fs = require('fs');

const fileExtension = 'txt';

async function main() 
{
    try 
    {
        let tsvRes = await fetch('https://docs.google.com/spreadsheets/d/1FoYdyEraEQuWofzbYCDPKN7EdKgS_2ZrsDrOA8scgwQ/export?format=tsv');
        let tsv = await tsvRes.text();

        let lines = tsv.split('\n');
        // First line contains full language names
        // Second line contains file extensions
        let codes = lines[1].split('\t');

        if (codes[0] == '')
        {
            codes[0] = 'i18n';
        }

        let outputFiles = [];

        for (let j = 2; j < lines.length; j++)
        {
            let entries = lines[j].split('\t');

            if (entries.length > 1)
            {
                let key = entries[0];

                if (key)
                {
                    for (let i = 0; i < codes.length; i++)
                    {
                        if (codes[i].trim())
                        {
                            if (outputFiles[i] == null)
                            {
                                outputFiles[i] = '# *DO NOT DIRECTLY EDIT THIS FILE, IT IS AUTOMATICALLY GENERATED AND IT IS BASED ON:*\n' +
                                                 '# https://docs.google.com/spreadsheet/ccc?key=0AmQEO36liL4FdDJLWVNMaVV2UmRKSnpXU09MYkdGbEE\n';
                            }
                            
                            if (codes[i] == 'i18n')
                            {
                                outputFiles[i] += key + '=' + key + '\n';
                            }
                            else
                            {
                                let value = (entries.length > i) ? entries[i] : '';

                                // Empty entries will be translated to English
                                if (value == '')
                                {
                                    value = entries[1];
                                }

                                value = value.trim();

                                //TODO Add encoding support
                                /*if (PropGen.encodeValues)
                                {
                                    value = encodeString(value);
                                }*/

                                let lang = codes[i].toLowerCase();
                                let rtl = false;
                                
                                if (lang == 'ar' || lang == 'fa' || lang == 'he')
                                {
                                    let embeddingLevels = bidi.getEmbeddingLevels(value);
                                    
                                    function isMixed(levels)
                                    {
                                        for (let i = 0; i < levels.length; i++)
                                        {
                                            if (levels[i] == 1) return true;
                                        }

                                        return false;
                                    };

                                    if (embeddingLevels.paragraphs[0].level == 1 || isMixed(embeddingLevels.levels))
                                    {
                                        console.log(value);
                                        rtl = true;
                                    }
                                }
                                
                                if (rtl)
                                {
                                    outputFiles[i] += key + '=' + '\u202B' + value + '\u202C' + '\n';
                                }
                                else
                                {
                                    // Checks for HTML entities in output
                                    if (value.includes('<') || value.includes('>'))
                                    {
                                        console.log('**** WARNING: HTML Entities in ' + lang + '/' + key + '=' + value);
                                    }

                                    outputFiles[i] += key + '=' + value + '\n';
                                }
                            }
                        }
                    }
                }
            }
        }

        const termsToTranslate = {
          alreadyOpen: {
            en: 'The tab for this container is already open!',
            fr: "L'onglet pour ce conteneur est déjà ouvert !",
          },
          closeOthers: {
            en: 'Close others',
            fr: 'Fermer les autres onglets',
          },
          createMapFromContainer: {
            en: 'Create map from container',
            fr: "Créer une carte à partir d'un conteneur",
          },
          editCentreonStyle: {
            en: 'Edit Centreon style',
            fr: 'Modifier le style Centreon',
          },
          editContainerDataToOpen: {
            en: 'To be able to edit the container, name it and then save the view.',
            fr: 'Pour pouvoir modifier le conteneur, nommez-le et enregistrez la vue.',
          },
          editContent: {
            en: 'Edit content',
            fr: 'Modifier le contenu',
          },
          editToSeeContainer: {
            en: 'Please edit container data to see the content of the container.',
            fr: 'Veuillez modifier les données du conteneur pour voir le contenu du conteneur.',
          },
          proceed: {
            en: 'Proceed',
            fr: 'Continuer',
          },
          proceedMessage: {
            en: `You have unsaved changes.\nIf you proceed, all changes will be lost.`,
            fr: `Vous avez des changements non enregistrés.\nSi vous continuez, toutes les modifications seront perdues.`,
          },
          saveToSeeContainer: {
            en: 'To be able to see the content of the container, save it.',
            fr: 'Pour pouvoir voir le contenu du conteneur, sauvegardez-le.',
          },
          canNotDeleteContainer: {
            en: "You are not allowed to close the last tab.",
            fr: 'Vous ne pouvez pas fermer le dernier onglet.',
          },
        };
      
          const indexI18 = codes.indexOf('i18n');
          const indexFr = codes.indexOf('fr');
          const indexEn = codes.indexOf('en');
      
          Object.keys(termsToTranslate).forEach((termToTranslate) => {
            const translateTermTo = termsToTranslate[termToTranslate];
            outputFiles[indexI18] += `${termToTranslate}=${termToTranslate}\n`;
            outputFiles[indexEn] += `${termToTranslate}=${translateTermTo.en}\n`;
            outputFiles[indexFr] += `${termToTranslate}=${translateTermTo.fr}\n`;
          });

        let outDir = './resources';

        if (!fs.existsSync(outDir))
        {
            fs.mkdirSync(outDir);
        }

        for (let i = 0; i < codes.length; i++)
        {
            if (codes[i].trim())
            {
                let ext = (codes[i] == 'en') ? '' : '_' + codes[i].toLowerCase();
                let filename = outDir + '/dia' + ext + '.' + fileExtension;
                fs.writeFileSync(filename, outputFiles[i], 'utf8');
                console.log(filename + ' created');
            }
        }
    }
    catch (e)
    {
        console.log(e);
    }
}

main();