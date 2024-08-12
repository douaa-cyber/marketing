const express = require('express');
const session = require('express-session');
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const stream = require('stream');
const qrcode = require('qrcode');
const exceljs = require('exceljs');
const multer = require('multer');
const jwt =require('jsonwebtoken');
const app = express();


<<<<<<< HEAD
const port = 3000;
const hostname = '192.168.2.66';



=======

const port = 10000;
const hostname = '0.0.0.0';
>>>>>>> 644a82e01b6b37be708f1b0f6988079a98888b55
app.use(express.static('public'));

//VIRIFER SI LE DIRECTORY EXIST
const pdfDir = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir);
}

//READ JSON FILES
fs.readFile('clientBMS.json', 'utf8', (err, data) => {
    if (err) throw err;
    clientBMS = JSON.parse(data);
});
//READ JSON FILES
fs.readFile('clientMONO.json', 'utf8', (err, data) => {
    if (err) throw err;
    clientMono = JSON.parse(data);
});

app.use(express.static('public'));

//CONNECTER AU BD
const bd = {
user: 'dou',
password: '2222',
server: 'localhost',
database: 'site_marketing',
options: {
  encrypt: false
}
};
//CREER SESSION
app.use(session({
name: "mono",
resave: false,
saveUninitialized: false,
secret: "hhfiuzzzzffglklkqkzj",
cookie: {
  sameSite: 'lax', 
  maxAge: 1000 * 60 * 60 * 24 * 7, // RESTE TOUT LE TEMPS
  secure: false,
},
}));


app.use(express.static(path.join(__dirname)));

app.get('/service-worker.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'service-worker.js'));
});


app.get('/summary/:id/excel', async (req, res) => {
  try {
    const pool = await sql.connect(bd);

    const agentId = parseInt(req.params.id, 10);
    const result = await pool.request()
      .input('id', sql.Int, agentId)
      .query(`
        SELECT 
          f.Wilaya,
          f.daira,
          f.Commune,
          SUM(CASE WHEN f.Activite LIKE 'electricien' THEN 1 ELSE 0 END) AS total_electricians,
          SUM(CASE WHEN f.Activite LIKE 'quincaillerie' THEN 1 ELSE 0 END) AS total_quincailleries
        FROM 
          formulaire f
          JOIN utilisateur u ON f.utilisateur_id = u.id
        WHERE u.id = @id
        GROUP BY f.Wilaya, f.daira, f.Commune
        ORDER BY f.Wilaya, f.daira, f.Commune
      `);

    if (result.recordset.length > 0) {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Résumé');

      // Title row
      const titleRow = worksheet.addRow(['Résumé des Électriciens et Quincailleries']);
      worksheet.mergeCells('A1:I1');
        
      worksheet.addRow(['Télécharger le fichier complet ici:']);
      worksheet.getCell(`A${worksheet.lastRow.number}`).value = {
    text: 'Télécharger le fichier Micro',
    hyperlink: `http://${hostname}:${port}/dashboard/${req.params.id}/excel` 
    
    };
     worksheet.getCell(`A${worksheet.lastRow.number}`).font = {
      color: { argb: 'FFFF0000' }, // Red color
      size: 14, // Font size
      underline: true // Optional: underline the text
  };

      const mergedTitleCell = worksheet.getCell('A1');
      mergedTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
      mergedTitleCell.font = { size: 16, bold: true };

      // Header row
      const headerRow = worksheet.addRow([
        'Wilaya', 'Total Électriciens Wilaya', 'Total Quincailleries Wilaya',
        'Daira', 'Total Électriciens Daira', 'Total Quincailleries Daira',
        'Commune', 'Total Électriciens Commune', 'Total Quincailleries Commune'
      ]);

      // Styling header rows
      headerRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ADD8E6' }
        };
        cell.font = {
          bold: true,
          color: { argb: '000000' },
          size: 13
        };
        cell.alignment = { horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
          bottom: { style: 'thin' }
        };
      });

      let lastWilaya = null;
      let lastDaira = null;
      let startRowWilaya = 3;  // Adjusted to start after the header row
      let startRowDaira = 3;

      result.recordset.forEach((row, index) => {
        const { Wilaya, daira, Commune, total_electricians, total_quincailleries } = row;

        // Add a new row for the Commune
        worksheet.addRow([
          Wilaya !== lastWilaya ? Wilaya : '',
          Wilaya !== lastWilaya ? result.recordset.filter(r => r.Wilaya === Wilaya).reduce((sum, r) => sum + r.total_electricians, 0) : '',
          Wilaya !== lastWilaya ? result.recordset.filter(r => r.Wilaya === Wilaya).reduce((sum, r) => sum + r.total_quincailleries, 0) : '',
          daira !== lastDaira ? daira : '',
          daira !== lastDaira ? result.recordset.filter(r => r.daira === daira).reduce((sum, r) => sum + r.total_electricians, 0) : '',
          daira !== lastDaira ? result.recordset.filter(r => r.daira === daira).reduce((sum, r) => sum + r.total_quincailleries, 0) : '',
          Commune,
          total_electricians,
          total_quincailleries
        ]);
   

        // Handle merging of cells for Wilaya
        if (Wilaya !== lastWilaya) {
          if (lastWilaya !== null) {
            worksheet.mergeCells(startRowWilaya, 1, worksheet.lastRow.number - 1, 1);
            worksheet.mergeCells(startRowWilaya, 2, worksheet.lastRow.number - 1, 2);
            worksheet.mergeCells(startRowWilaya, 3, worksheet.lastRow.number - 1, 3);
          }
          startRowWilaya = worksheet.lastRow.number;
          lastWilaya = Wilaya;
        }

        // Handle merging of cells for Daira
        if (daira !== lastDaira) {
          if (lastDaira !== null) {
            worksheet.mergeCells(startRowDaira, 4, worksheet.lastRow.number - 1, 4);
            worksheet.mergeCells(startRowDaira, 5, worksheet.lastRow.number - 1, 5);
            worksheet.mergeCells(startRowDaira, 6, worksheet.lastRow.number - 1, 6);
          }
          startRowDaira = worksheet.lastRow.number;
          lastDaira = daira;
        }
      });

      // Merge cells for the last Wilaya and Daira
      if (lastWilaya !== null) {
        worksheet.mergeCells(startRowWilaya, 1, worksheet.lastRow.number, 1);
        worksheet.mergeCells(startRowWilaya, 2, worksheet.lastRow.number, 2);
        worksheet.mergeCells(startRowWilaya, 3, worksheet.lastRow.number, 3);
      }

      if (lastDaira !== null) {
        worksheet.mergeCells(startRowDaira, 4, worksheet.lastRow.number, 4);
        worksheet.mergeCells(startRowDaira, 5, worksheet.lastRow.number, 5);
        worksheet.mergeCells(startRowDaira, 6, worksheet.lastRow.number, 6);
      }
  
  
     
    
      for (let rowIndex = 4; rowIndex <= worksheet.lastRow.number; rowIndex++) {
        const row = worksheet.getRow(rowIndex);
        row.eachCell({ includeEmpty: true }, (cell) => {
          const isOddRow = (rowIndex - 2) % 2 === 1;
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffffff' }
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            bottom: { style: 'thin' }
          };
          cell.alignment ={
            horizontal: 'center',
            vertical: 'middle'
          };
        });
      }
      worksheet.autoFilter = {
        from: 'A3',
        to: 'I3'
      };

  worksheet.columns.forEach(column => {
    column.width = 30; 
  });
      const excelFilename = 'Résumé_Electriciens_Quincailleries.xlsx';
      const excelFilePath = path.join(__dirname, 'exports', excelFilename);

      await workbook.xlsx.writeFile(excelFilePath);

      res.download(excelFilePath, excelFilename, (err) => {
        if (err) {
          console.error('Erreur lors du téléchargement du fichier Excel :', err.message);
          res.status(500).send('Erreur interne du serveur lors du téléchargement du fichier Excel');
        } else {
          fs.unlinkSync(excelFilePath);
        }
      });
    } else {
      res.status(404).send('Aucune donnée trouvée pour le résumé');
    }
  } catch (err) {
    console.error('Erreur de récupération des données pour le résumé Excel :', err.message);
    res.status(500).send('Erreur interne du serveur');
  }
});


//VIRIFIER SI JE SUIS ADMIN
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const isAdmin = (req, res, next) => {
  console.log(req.session.role);
if (req.session.role === 'admin') {
 
  next();
  
} else {
  res.redirect("/");
}
};

app.get('/missions', async (req, res) => {
  try {
      const pool = await sql.connect(bd);

      // Fetch missions
      const missionsResult = await pool.request().query(`
          SELECT m.id, m.titre, m.date_deb, m.date_fin, m.region, m.wilaya, u.nom, u.prenom, m.status
          FROM mission m
          LEFT JOIN utilisateur u ON m.agent_id = u.id
      `);
      const missions = missionsResult.recordset;

      // Define agents query
      let agentsQuery = "SELECT id, nom, prenom, societe FROM utilisateur";
      
      // Filter agents based on session role and societe
      if (req.session.role === 'responsable') {
          if (req.session.societe === 'mono') {
              agentsQuery += " WHERE societe = 'mono'";
          } else {
              agentsQuery += " WHERE societe = 'bms'";
          }
      } else {
          agentsQuery += " WHERE societe = 'bms'"; // Default to 'bms' for all other roles
      }

      const agentsResult = await pool.request().query(agentsQuery);
      const agents = agentsResult.recordset;

      // Render the page, passing role and societe
      res.render('createmission', { 
          missions, 
          agents, 
          role: req.session.role, 
          societe: req.session.societe 
      });

  } catch (err) {
      console.error('Error fetching data:', err.message);
      res.status(500).send('Internal server error');
  }
});


// pour responsable
app.post('/missions',async (req, res) => {
  const { title, start_date, end_date, region, wilaya,agent_id} = req.body;

  try {
    const pool = await sql.connect(bd);
    await pool.request()
      .input('title', sql.VarChar, title)
      .input('start_date', sql.Date, start_date)
      .input('end_date', sql.Date, end_date)
      .input('region', sql.VarChar, region)
      .input('wilaya', sql.VarChar, wilaya)
      .input('agent_id', sql.Int, agent_id) 
      .query('INSERT INTO mission (titre, date_deb, date_fin, region, wilaya, agent_id) VALUES (@title, @start_date, @end_date, @region, @wilaya, @agent_id)');
    
  
  } catch (err) {
    console.error('Error creating mission:', err.message);
    res.status(500).send('Internal server error');
  }
});



app.get('/missions/:agentId', async (req, res) => {
  const agentId = req.params.agentId;
  
  try {
    const pool = await sql.connect(bd);
   const result = await pool.request()
      .input('agent_id', sql.Int, agentId)
      .query('SELECT * FROM mission where agent_id =@agent_id');
    res.render('agent_mission',{missions : result.recordset});
     
  } catch (err) {
    console.error('Error fetching missions:', err.message);
    res.status(500).send('Internal server error');
  }
});

app.post('/missions/:id/complete', async (req, res) => {
  const missionId = req.params.id;

  try {
    const pool = await sql.connect(bd);
    await pool.request()
      .input('id', sql.Int, missionId)
      .input('status', sql.VarChar, 'Terminer') // Mark as completed
      .query('UPDATE mission SET status = @status WHERE id = @id');

    res.redirect('/missions'); 
  } catch (err) {
    console.error('Error updating mission status:', err.message);
    res.status(500).send('Internal server error');
  }
});


app.get('/agent/forms/excel', async (req, res) => {
  if (req.session.username) {
    const {id,startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).send('Les dates de début et de fin sont requises.');
    }
    try{ 

       const pool = await sql.connect(bd);
      const result = await pool.request()
        
        .input('startDate', sql.Date, new Date(startDate))
        .input('endDate', sql.Date, new Date(endDate))
        .input('id_a',sql.Int,id)
         .query(`
            SELECT u.id AS agent_id, u.nom AS nom_agent, u.prenom AS prenom_agent, f.Wilaya AS wilaya,f.plaque,f.espacepub,f.daira,
                   f.MissionObjective, f.MissionDate, f.Nom AS nom_client, f.Prenom AS prenom_client,
                   f.Commune, f.Activite, f.Tel, f.Distributeur,f.nom_magasin,
                   f.produitLampe, f.produitAppareillage, f.produitDisjoncteur,
                   f.concurrentLampe, f.concurrentAppareillage, f.concurrentDisjoncteur,
                   f.evaluecli, f.evalueBms, f.evaluconcurrent, f.commentaire, f.id AS form_id,f.longitude AS longitude ,f.latitude AS latitude 
            FROM formulaire f
            JOIN utilisateur u ON f.utilisateur_id = u.id
            WHERE u.id = @id_a  AND MissionDate >= @startDate 
            AND MissionDate<= @endDate
            ORDER BY f.Wilaya, f.MissionDate
          `);
        console.log(result);
          if (result.recordset.length > 0) {
            const workbook = new exceljs.Workbook();
            
            const groupedByWilaya = result.recordset.reduce((acc, formulaire) => {
              if (!acc[formulaire.wilaya]) acc[formulaire.wilaya] = [];
              acc[formulaire.wilaya].push(formulaire);
              return acc;
            }, {});
          
            for (const wilaya in groupedByWilaya) {
              const worksheet = workbook.addWorksheet(wilaya);
          
              const titleRow = worksheet.addRow(['RAPPORT VISITE CLIENT']);
              worksheet.mergeCells('A1:R1');
              const mergedTitleCell = worksheet.getCell('A1');
              mergedTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
              mergedTitleCell.font = { size: 16, bold: true };
          
              // Add gap rows
              for (let i = 0; i < 3; i++) {
                worksheet.addRow([]);
              }
          
              // Header rows
              const headerRow1 = worksheet.addRow([
                'Objectif de Mission', 'Activité', 'Daira','Commune', 'Date de Mission', 'Nom Magasin',
                'Nom Client', 'Prenom Client', 'Téléphone','EspacePub','Plaque', 'Produits Offerts', '', 
                'Informations Produits', '', '', '', '', '', '', '',''
              ]);
          
              const headerRow2 = worksheet.addRow([
                '', '', '', '', '',
                '', '', '','','','', 'Nom', 'Quantité', 
                'Gamme Produits', '', '', 'Concurrent', '', '',
                'Fournisseur', 'Commentaire','evaluation'
              ]);
          
              const headerRow3 = worksheet.addRow([
                '', '', '', '', '',
                '', '', '', '', '','','','', 
                'Produit Lampe', 'Produit Appareillage', 'Produit Disjoncteur',
                'Concurrent Lampe', 'Concurrent Appareillage', 'Concurrent Disjoncteur', 
                '', '',''
              ]);
          
              // Styling header rows
              const addHeaderCellStyle = (cell, isFirstRow = true, colNumber) => {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'ADD8E6' } // Sky blue background
                };
                cell.font = {
                  bold: true,
                  color: { argb: '000000' }, // Black text
                  size: 13 // Font size
                };
                cell.alignment = { horizontal: 'center' }; // Center align text
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  right: { style: 'thin' },
                  ...((!isFirstRow && (colNumber >= 1 && colNumber <= 8 || colNumber >= 15 && colNumber <= 17)) ? {} : { bottom: { style: 'thin' } })
                };
              };
          
              headerRow1.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                addHeaderCellStyle(cell, true, colNumber);
                if (colNumber === 9 || colNumber === 11) {
                  cell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
              });
          
              headerRow2.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                addHeaderCellStyle(cell, false, colNumber);
              });
          
              headerRow3.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                addHeaderCellStyle(cell, false, colNumber);
              });
          
              // Merge cells for the multi-row headers
              worksheet.mergeCells('L5:M5'); // "Articles"
              worksheet.mergeCells('N5:V5'); // "Informations Produits"
              worksheet.mergeCells('V6:V7'); // "Informations Produits"
              worksheet.mergeCells('N6:P6'); // "Gamme Produits"
              worksheet.mergeCells('Q6:S6'); // "Concurrent"
              worksheet.mergeCells('T6:T7'); // "Distributeur"
              worksheet.mergeCells('U6:U7'); // "Commentaire"
          
              worksheet.mergeCells('A5:A7');
              worksheet.mergeCells('B5:B7');
              worksheet.mergeCells('C5:C7');
              worksheet.mergeCells('D5:D7');
              worksheet.mergeCells('E5:E7');
              worksheet.mergeCells('F5:F7');
              worksheet.mergeCells('G5:G7');
              worksheet.mergeCells('L6:L7');
              worksheet.mergeCells('M6:M7');
              
              worksheet.mergeCells('H5:H7');
              worksheet.mergeCells('I5:I7');
              worksheet.mergeCells('J5:J7');
              worksheet.mergeCells('K5:K7')
          
              // Apply alignment to merged cells
              const mergeRanges = ['L5:M5','N5:V5','V6:V7','N6:P6','Q6:S6','T6:T7','U6:U7',
              'A5:A7','B5:B7','C5:C7','D5:D7','E5:E7','F5:F7','G5:G7','L6:L7','M6:M7', 
              'H5:H7','I5:I7','J5:J7','K5:K7'              ];
              // Center alignement 
              mergeRanges.forEach(range => {
                const [startCell] = range.split(':');
                const mergedCell = worksheet.getCell(startCell);
                mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
              });
          
              const safeSplit = (value) => {
                return value ? value.split(',').map(v => v.trim()).filter(v => v) : [];
              };
              
               
              for (const formulaire of groupedByWilaya[wilaya]) {
                const clientName = `${formulaire.nom_client} ${formulaire.prenom_client}`;
                console.log(clientName);
              
                app.use('/exports', express.static(path.join(__dirname, 'exports')));

           
                
                //split article in two nom , quantite
                const articlesResult = await pool.request()
                  .input('formId', sql.Int, formulaire.form_id)
                  .query(`
                    SELECT nom_article, quantite
                    FROM articles
                    WHERE id_form = @formId
                  `);
          
                const articles = articlesResult.recordset.map(article => ({
                  nom: article.nom_article,
                  quantite: article.quantite
                }));
                 
                const produitsLampe = safeSplit(formulaire.produitLampe);
                const produitsAppareillage = safeSplit(formulaire.produitAppareillage);
                const produitsDisjoncteur = safeSplit(formulaire.produitDisjoncteur);
                const concurrentsLampe = safeSplit(formulaire.concurrentLampe);
                const concurrentsAppareillage = safeSplit(formulaire.concurrentAppareillage);
                const concurrentsDisjoncteur = safeSplit(formulaire.concurrentDisjoncteur);
                const Fournisseur =safeSplit(formulaire.Distributeur);
    
                // Determine the maximum length of product/competitor lists
                const maxLength = Math.max(produitsLampe.length, produitsAppareillage.length, produitsDisjoncteur.length,
                                           concurrentsLampe.length, concurrentsAppareillage.length, concurrentsDisjoncteur.length,
                                           articles.length,Fournisseur.length);
          
                let startRow = worksheet.rowCount + 1;
                let endRow;
          
                // Create a row for each combination of products/competitors
                for (let i = 0; i < maxLength; i++) {
                  const link = `https://www.google.com/maps/place/${formulaire.latitude},${formulaire.longitude}`;
                  const row = worksheet.addRow([
                    formulaire.MissionObjective,
                    formulaire.Activite,
                    formulaire.daira,
                    formulaire.Commune,
                    formulaire.MissionDate,
                    formulaire.nom_magasin,
                    formulaire.nom_client,
                    formulaire.prenom_client,
                    formulaire.Tel,
                    formulaire.espacepub,
                    formulaire.plaque,
                    articles[i] ? articles[i].nom : '',
                    articles[i] ? articles[i].quantite : '',
                    produitsLampe[i] || '',
                    produitsAppareillage[i] || '',
                    produitsDisjoncteur[i] || '',
                    concurrentsLampe[i] || '',
                    concurrentsAppareillage[i] || '',
                    concurrentsDisjoncteur[i] || '',
                    Fournisseur[i] || '',
                    formulaire.commentaire,
                    formulaire.evaluecli
                  ]);
      
                  row.getCell(23).value = {
                    text: 'Voir dans Map',
                    hyperlink: link
                  };
                 
      
                
                  //add borders
                  row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.border = {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      right: { style: 'thin' },
                      bottom: { style: 'thin' }
                    };
                  });
          
                  endRow = worksheet.rowCount;
                }
          
                // Merge cells for columns
                worksheet.mergeCells(`A${startRow}:A${endRow}`);
                worksheet.mergeCells(`B${startRow}:B${endRow}`);
                worksheet.mergeCells(`C${startRow}:C${endRow}`);
                worksheet.mergeCells(`D${startRow}:D${endRow}`);
                worksheet.mergeCells(`E${startRow}:E${endRow}`);
                worksheet.mergeCells(`F${startRow}:F${endRow}`);
                worksheet.mergeCells(`G${startRow}:G${endRow}`);
                worksheet.mergeCells(`H${startRow}:H${endRow}`);
                worksheet.mergeCells(`I${startRow}:I${endRow}`);
                worksheet.mergeCells(`J${startRow}:J${endRow}`);
                worksheet.mergeCells(`K${startRow}:K${endRow}`);
                
              
                worksheet.mergeCells(`U${startRow}:U${endRow}`);
                worksheet.mergeCells(`V${startRow}:V${endRow}`);
                worksheet.mergeCells(`W${startRow}:W${endRow}`);
          
                // Apply alignment to merged cells
                const mergedRanges = [
                  `A${startRow}:A${endRow}`,`W${startRow}:W${endRow}`, `B${startRow}:B${endRow}`, `C${startRow}:C${endRow}`,
                  `D${startRow}:D${endRow}`, `E${startRow}:E${endRow}`, `F${startRow}:F${endRow}`,
                  `G${startRow}:G${endRow}`, `H${startRow}:H${endRow}`, `Q${startRow}:Q${endRow}`,
                  `R${startRow}:R${endRow}`, `S${startRow}:S${endRow}`,`T${startRow}:T${endRow}`
                  ,`I${startRow}:I${endRow}`
                  ,`J${startRow}:J${endRow}`
                  ,`K${startRow}:K${endRow}`,`U${startRow}:U${endRow}`,`V${startRow}:V${endRow}`
                ];
          
                mergedRanges.forEach(range => {
                  const [startCell] = range.split(':');
                  const mergedCell = worksheet.getCell(startCell);
                  mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
              }
               //apply width to cells
              worksheet.columns.forEach(column => {
                if (['Produit Lampe', 'Produit Appareillage', 'Produit Disjoncteur', 'Concurrent Lampe', 'Concurrent Appareillage', 'Concurrent Disjoncteur'].includes(column.header)) {
                  column.width = 60; 
                } else {
                  column.width = 30; 
                }
              });
            }
               //name of file with path
            const agent = result.recordset[0];
            const excelFilename = `Formulaires_${agent.nom_agent}_${agent.prenom_agent}.xlsx`;
            const excelFilePath = path.join(__dirname, 'exports', excelFilename);
          
            await workbook.xlsx.writeFile(excelFilePath);
          
            res.download(excelFilePath, excelFilename, (err) => {
              if (err) {
                console.error('Erreur lors du téléchargement du fichier Excel :', err.message);
                res.status(500).send('Erreur interne du serveur lors du téléchargement du fichier Excel');
              } else {
                fs.unlinkSync(excelFilePath);
              }
            });
          } else {
            res.status(404).send('Aucun formulaire trouvé pour cet agent');
          }
      } catch (err) {
        console.error('Erreur de récupération des détails du formulaire pour Excel :', err.message);
        res.status(500).send('Erreur interne du serveur');
      }
    }
    });






app.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await getUsers();
    res.render('adminUsers', { users });
  } catch (error) {
    res.status(500).send('Server error');
    console.log(error);
  }
});
app.post('/admin/users', isAdmin, async (req, res) => {
  const { company } = req.body;
  
  if (!company) {
    return res.status(400).send('No company selected');
  }
  
  try {
    const pool = await sql.connect(bd);
    const query = 'SELECT * FROM utilisateur WHERE societe = @company'; 
    
    const result = await pool.request()
      .input('company', sql.NVarChar, company)  
      .query(query);
    
    res.render('adminUsers', { users: result.recordset });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

async function getUsers() {
  const query = 'SELECT id, username, roles FROM utilisateur';
  const result = await sql.query(query);
  return result.recordset;
}


app.post('/admin/users/updateRole', isAdmin, async (req, res) => {

  const { Id, newRole} = req.body;
    try {
      const pool = await sql.connect(bd);
      const query = 'UPDATE utilisateur SET roles = @newRole WHERE id = @userId';
      await pool.request()
        .input('newRole', sql.NVarChar, newRole)  
        .input('userId', sql.Int, Id)         
        .query(query);
    
    res.redirect('/admin/users');
  } catch (error) {
    res.status(500).send('Server error');
    console.log(error);
  }
});
async function resetPassword(userEmail, newPassword) {
  try {
    let pool = await sql.connect(bd);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.request()
      .input('email', sql.VarChar, userEmail)
      .input('password', sql.VarChar, hashedPassword)
      .query('UPDATE utilisateur SET password = @password WHERE email = @email');

    console.log('Password reset successfully.');
    sql.close();
  } catch (err) {
    console.error('SQL error', err);
    sql.close();
  }
}
app.get('/reset-password', async (req, res) => {
  res.sendFile(path.join(__dirname, 'reinisializationmp.html'));
})
app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    await resetPassword(email, newPassword);
    res.send(`
      <script>
        alert("Mot de passe réinitialisé avec succès.");
        window.location.href = "/login";
      </script>
    `);
  } catch (err) {
    console.error("Erreur de réinitialisation du mot de passe:", err.message);
    res.send(`
      <script>
        alert("Erreur de réinitialisation du mot de passe.");
        window.location.href = "/reset-password";
      </script>
    `);
  }
});
app.get('/getNameSuggestions', async (req, res) => {
  const query = req.query.query;

  try {
    const pool = await sql.connect(bd);
    const result = await pool.request()
      .input('query', sql.NVarChar, `${query}%`)
      .query(`
        SELECT client AS FullName
        FROM client
        WHERE client LIKE @query 
      `);
  console.log(result);
    if (result.recordset.length > 0) {
      const names = result.recordset.map(record => record.FullName);
      res.json(names);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('Error fetching name suggestions', err);
    res.status(500).json({ message: 'Error fetching name suggestions' });
  }
});

app.get('/getClientInfo', async (req, res) => {
  const FullName = req.query.Nom;

  try {
    const pool = await sql.connect(bd);
    const result = await pool.request()
      .input('Nom', sql.NVarChar, FullName)
      .query(`
        SELECT NomClient,date,wilaya,telephone,adresse
        FROM reclamation
        WHERE NomClient= @Nom
      `);

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving client info' });
  }
});

app.get('/api/next-reclamation-id', async (req, res) => {
  try {
    const pool = await sql.connect(bd);
    const result = await pool.request()
      .query('SELECT ISNULL(MAX(id), 0) + 1 AS nextId FROM reclamation');
      res.json(result.recordset[0]);
  } catch (error) {
      res.status(500).send('Error fetching next reclamation ID');
  }
});

app.get('/designation/:code', async (req, res) => {
  const code = req.params.code;
  try {
      const pool = await sql.connect(bd);
      const result = await pool.request()
          .input('code', sql.NVarChar, code)
          .query(`SELECT Nom FROM articlebms WHERE Référenceinterne = @code`);
      
      if (result.recordset.length > 0) {
          res.json({ designation: result.recordset[0].Nom });
      } else {
          res.status(404).json({ error: 'Code not found' });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


app.get('/codes/:prefix', async (req, res) => {
  const prefix = req.params.prefix.trim();
    console.log(prefix);
  if (!prefix) {
    return res.status(400).json({ error: 'Prefix is required' });
  }

  try {
    await sql.connect(bd);

    const result = await sql.query`
      SELECT Référenceinterne
      FROM articlebms
      WHERE Référenceinterne LIKE ${prefix} + '%'
    `;

    if (result.recordset.length > 0) {
      const codes = result.recordset.map(record => record.Référenceinterne);
      res.json({ codes });
    } else {
      res.status(404).json({ error: 'No codes found' });
    }
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ error: 'Error while fetching codes' });
  }
});


function checkUser(req, res, next) {
  if (req.session.username === 'YacineMed') {
      next();
  } else {
      res.redirect("/");
  }
}

app.get("/reclamation",checkUser,async(req,res)=>{
 
  res.render('reclamationclient.ejs');
});
app.post('/reclamation', async (req, res) => {
 
  const { id,num,telephone,dateRec,wilaya,adresse,status,date,nom, bln, nomR, telephoneR, reclamationTelephone } = req.body;
  const causesRetour = req.body.causeRetour || [];
  const codes = req.body.code || [];
  const designations = req.body.designation || [];
  const colis = req.body.colis || [];
  const pieces = req.body.pieces || [];
  const etats = req.body.etat || [];
  const valeurs = req.body.valeurs || [];
  const descriptions = req.body.description || [];

  // Log the received data for debugging
  console.log('Received Data:', req.body);

  try {
    const pool = await sql.connect(bd);


    // Vérifier si le client existe
    const clientCheckResult = await pool.request()
      .input('clientName', sql.NVarChar,nom)
      .query('SELECT COUNT(*) AS clientCount FROM client WHERE client = @clientName');

    const clientCount = clientCheckResult.recordset[0].clientCount;

    if (clientCount === 0) {
      // Ajouter le client s'il n'existe pas
      await pool.request()
        .input('clientName', sql.NVarChar, nom)
        .query('INSERT INTO client  VALUES (@clientName)');
    }

    const causesRetourStr = causesRetour.join(', ');
    const codesStr = codes.join(', ');
    const designationsStr = designations.join(', ');
    const colisStr = colis.join(', ');
    const piecesStr = pieces.join(', ');
    const valeursStr = valeurs.join(', ');
    const etatsStr = etats.join(', ');
    const descriptionsStr = descriptions.join(', ');

    await pool.request()
      .input('num', sql.NVarChar, num)
      .input('bln', sql.NVarChar, bln)
      .input('nom', sql.VarChar, nom)
      .input('nomR', sql.VarChar, nomR)
      .input('telephoneR', sql.VarChar, telephoneR)
      .input('reclamationTelephone', sql.VarChar, reclamationTelephone)
      .input('causeRetour', sql.NVarChar, causesRetourStr)
      .input('code', sql.NVarChar, codesStr)
      .input('designation', sql.NVarChar, designationsStr)
      .input('colis', sql.NVarChar, colisStr)
      .input('pieces', sql.NVarChar, piecesStr)
      .input('valeurs', sql.NVarChar,valeursStr)
      .input('dateR', sql.NVarChar, date)
      .input('etat', sql.NVarChar, etatsStr)
      .input('status',sql.VarChar,status)
      .input('telephone',sql.VarChar,telephone)
      .input('date',sql.VarChar,dateRec)
      .input('wilaya',sql.VarChar,wilaya)
      .input('adresse',sql.VarChar,adresse)
      .input('description', sql.NVarChar, descriptionsStr)
      .query(`
        INSERT INTO reclamation (num,bln, reclamant,status,telephone,date,wilaya,adresse, telephoneR, modalite,NomClient,dateR, cause,code,designation, colis, pieces,valeurs, etat, description)
        VALUES (@num,@bln, @nomR,@status,@telephone,@date,@wilaya,@adresse, @telephoneR, @reclamationTelephone,@nom,@dateR, @causeRetour,@code,@designation, @colis, @pieces,@valeurs, @etat, @description);
      `);

      res.render('reclamationclient', {message:'Réclamation enregistrée avec succès' });
  
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).send('Erreur lors de l\'enregistrement de la réclamation');
  }

});


app.get('/reclamationsreport', async (req, res) => {
  try {
    const filePath = await generateAllReclamationsFile(); // Adjust this to handle specifics
    res.download(filePath, 'All_Reclamations_Report.xlsx');
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send('Erreur lors de la génération du rapport');
  }
});

app.get('/viewreport', (req, res) => {
  res.render('reclamationsreport');
});





const wilayasData = JSON.parse(fs.readFileSync('wilaya.json', 'utf8'));



const generateAllReclamationsFile = async () => {
  const pool = await sql.connect(bd);

  // Récupérer toutes les réclamations
  const result = await pool.request().query(`
   SELECT * FROM reclamation WHERE status = 'Cloturé'
  `);

  const reclamations = result.recordset;
console.log(reclamations);
  // Trier les réclamations par date
  reclamations.sort((a, b) => new Date(a.dateR) - new Date(b.dateR));

  const workbook = new exceljs.Workbook();
const worksheet = workbook.addWorksheet('Réclamations');

// Ajouter les en-têtes
const headerRow1 = worksheet.addRow([
   'Bon Livraison','Wilaya', 'Date De reclamation','Date de traitement', 'Nom Client','Télephone', 
  'Probleme', 'Informations Articles'
]);

const headerRow2 = worksheet.addRow([
  '', '', '', '', '', '', '', 'Code', 'Désignation', 'Quantité', '','Valeur', 'État'
]);

const headerRow3 = worksheet.addRow([
  '', '', '', '', '', '', '', '', '','Colis', 'Pièces', '',''
]);

// Style pour les en-têtes
const addHeaderCellStyle = (cell, isFirstRow = true, colNumber) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'ADD8E6' } // Couleur de fond bleu clair
  };
  cell.font = {
    bold: true,
    color: { argb: '000000' }, // Texte noir
    size: 13 // Taille de la police
  };
  cell.alignment = { horizontal: 'center' }; // Aligner le texte au centre
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    ...((!isFirstRow && (colNumber >= 1 && colNumber <= 7 || colNumber >= 13 && colNumber <= 15)) ? {} : { bottom: { style: 'thin' } })
  };
};

headerRow1.eachCell({ includeEmpty: true }, (cell, colNumber) => {
  addHeaderCellStyle(cell, true, colNumber);
  if (colNumber === 8 || colNumber === 10) {
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  }
});

headerRow2.eachCell({ includeEmpty: true }, (cell, colNumber) => {
  addHeaderCellStyle(cell, false, colNumber);
});

headerRow3.eachCell({ includeEmpty: true }, (cell, colNumber) => {
  addHeaderCellStyle(cell, false, colNumber);
});

// Fusionner les cellules
worksheet.mergeCells('A1:A3'); // Fusionner A1:A3
worksheet.mergeCells('B1:B3'); // Fusionner B1:B3
worksheet.mergeCells('C1:C3'); // Fusionner C1:C3
worksheet.mergeCells('D1:D3'); // Fusionner D1:D3
worksheet.mergeCells('E1:E3'); // Fusionner E1:E3
worksheet.mergeCells('F1:F3'); // Fusionner F1:F3
worksheet.mergeCells('G1:G3'); // Fusionner G1:G3
 
worksheet.mergeCells('H1:M1'); // Fusionner I2:I3
worksheet.mergeCells('H2:H3'); // Fusionner J2:J3
worksheet.mergeCells('I2:I3'); // Fusionner M2:M3
worksheet.mergeCells('J2:K2'); // Fusionner N1:N3
worksheet.mergeCells('L2:L3');

worksheet.mergeCells('M2:M3');



// Appliquer l'alignement aux cellules fusionnées
const mergeRanges = [ 'A1:A3', 'B1:B3', 'C1:C3', 'D1:D3', 'E1:E3', 'F1:F3', 'G1:G3', 'H1:M1', 'H2:H3', 'I2:I3', 'J2:K2', 'L2:L3', 'M2:M3', 'N1:N3'
];

mergeRanges.forEach(range => {
  const [startCell] = range.split(':');
  const mergedCell = worksheet.getCell(startCell);
  mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
});

// Définir la largeur des colonnes
worksheet.columns.forEach(column => {
  column.width = 30; // Ajuster la largeur selon vos besoins
});

// Ajouter les réclamations avec les colonnes vides pour les sections supplémentaires
reclamations.forEach(reclamation => {
  const cause = safeSplit(reclamation.cause);
  const code = safeSplit(reclamation.code);
  const designation = safeSplit(reclamation.designation);
  const colis = safeSplit(reclamation.colis);
  const pieces = safeSplit(reclamation.pieces);
  const etat = safeSplit(reclamation.etat);
  const valeurs =safeSplit(reclamation.valeurs);

  // Déterminer la longueur maximale des listes d'articles
  const maxLength = Math.max(cause.length, code.length, designation.length,
                             colis.length, pieces.length, etat.length,valeurs.length);
  let startRow = worksheet.rowCount + 1;
  let endRow;
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
};

  for (let i = 0; i < maxLength; i++) {
    worksheet.addRow([
      
      reclamation.bln,
      reclamation.wilaya,
      formatDate(reclamation.dateR), 
      formatDate(reclamation.date), 
      reclamation.NomClient,
      reclamation.telephone,
      cause[i] || '',
      code[i] || '',
      designation[i] || '',
      colis[i] || '',
      pieces[i] || '',
      valeurs[i] || '',
      etat[i] || ''
    ]).eachCell({ includeEmpty: true }, (cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });
    endRow = worksheet.rowCount;
  
  }
 
  
  worksheet.mergeCells(`A${startRow}:A${endRow}`);
  worksheet.mergeCells(`B${startRow}:B${endRow}`);
  worksheet.mergeCells(`C${startRow}:C${endRow}`);
  worksheet.mergeCells(`D${startRow}:D${endRow}`);
  worksheet.mergeCells(`E${startRow}:E${endRow}`);
  worksheet.mergeCells(`F${startRow}:F${endRow}`);
  worksheet.mergeCells(`N${startRow}:N${endRow}`);
  

  // Appliquer l'alignement aux cellules fusionnées
  const mergedRanges = [
    `A${startRow}:A${endRow}`, `B${startRow}:B${endRow}`, `C${startRow}:C${endRow}`,
    `D${startRow}:D${endRow}`, `E${startRow}:E${endRow}`, `F${startRow}:F${endRow}`,
    `N${startRow}:N${endRow}`
  ];

  mergedRanges.forEach(range => {
    const [startCell] = range.split(':');
    const mergedCell = worksheet.getCell(startCell);
    mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
  });
});

worksheet.autoFilter = {
  from: 'A3',
  to: 'M3'
};


 

  // Nom du fichier pour toutes les réclamations
  const fileName = 'All_Reclamations_Report.xlsx';
  const filePath = path.join(__dirname, 'exports', fileName);
  
  await workbook.xlsx.writeFile(filePath);

  return filePath;
};

// Helper function for safely splitting and trimming strings
const safeSplit = (value) => {
  return value ? value.split(',').map(v => v.trim()).filter(v => v) : [];
};


app.get('/dashboard/:id/excel', async (req, res) => {
try {
  const pool = await sql.connect(bd);

  const result = await pool.request()
    .input('id', sql.Int, req.params.id)
    .query(`
      SELECT u.id AS agent_id, u.nom AS nom_agent, u.prenom AS prenom_agent, f.Wilaya AS wilaya,
             f.MissionObjective, f.MissionDate, f.Nom AS nom_client, f.Prenom AS prenom_client,
             f.Commune, f.Activite, f.Tel, f.Distributeur,f.nom_magasin,
             f.produitLampe, f.produitAppareillage, f.produitDisjoncteur,
             f.concurrentLampe, f.concurrentAppareillage, f.concurrentDisjoncteur,
             f.evaluecli, f.evalueBms,f.daira,f.espacepub,f.plaque, f.evaluconcurrent, f.commentaire, f.id AS form_id,f.longitude AS longitude ,f.latitude AS latitude 
      FROM formulaire f
      JOIN utilisateur u ON f.utilisateur_id = u.id
      WHERE u.id = @id
      ORDER BY f.Wilaya, f.MissionDate
    `);

    if (result.recordset.length > 0) {
      const workbook = new exceljs.Workbook();
      
      const groupedByWilaya = result.recordset.reduce((acc, formulaire) => {
        if (!acc[formulaire.wilaya]) acc[formulaire.wilaya] = [];
        acc[formulaire.wilaya].push(formulaire);
        return acc;
      }, {});
    
      for (const wilaya in groupedByWilaya) {
        const worksheet = workbook.addWorksheet(wilaya);
    
        // Title row
        const titleRow = worksheet.addRow(['RAPPORT VISITE CLIENT']);
              worksheet.mergeCells('A1:R1');
              const mergedTitleCell = worksheet.getCell('A1');
              mergedTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
              mergedTitleCell.font = { size: 16, bold: true };
          
              // Add gap rows
              for (let i = 0; i < 3; i++) {
                worksheet.addRow([]);
              }
          
              // Header rows
              const headerRow1 = worksheet.addRow([
                'Objectif de Mission', 'Activité', 'Daira','Commune', 'Date de Mission', 'Nom Magasin',
                'Nom Client', 'Prenom Client', 'Téléphone','EspacePub','Plaque', 'Produits Offerts', '', 
                'Informations Produits', '', '', '', '', '', '', '',''
              ]);
          
              const headerRow2 = worksheet.addRow([
                '', '', '', '', '',
                '', '', '','','','', 'Nom', 'Quantité', 
                'Gamme Produits', '', '', 'Concurrent', '', '',
                'Fournisseur', 'Commentaire','evaluation'
              ]);
          
              const headerRow3 = worksheet.addRow([
                '', '', '', '', '',
                '', '', '', '', '','','','', 
                'Produit Lampe', 'Produit Appareillage', 'Produit Disjoncteur',
                'Concurrent Lampe', 'Concurrent Appareillage', 'Concurrent Disjoncteur', 
                '', '',''
              ]);
          
              // Styling header rows
              const addHeaderCellStyle = (cell, isFirstRow = true, colNumber) => {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'ADD8E6' } // Sky blue background
                };
                cell.font = {
                  bold: true,
                  color: { argb: '000000' }, // Black text
                  size: 13 // Font size
                };
                cell.alignment = { horizontal: 'center' }; // Center align text
                cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  right: { style: 'thin' },
                  ...((!isFirstRow && (colNumber >= 1 && colNumber <= 8 || colNumber >= 15 && colNumber <= 17)) ? {} : { bottom: { style: 'thin' } })
                };
              };
          
              headerRow1.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                addHeaderCellStyle(cell, true, colNumber);
                if (colNumber === 9 || colNumber === 11) {
                  cell.alignment = { horizontal: 'center', vertical: 'middle' };
                }
              });
          
              headerRow2.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                addHeaderCellStyle(cell, false, colNumber);
              });
          
              headerRow3.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                addHeaderCellStyle(cell, false, colNumber);
              });
          
              // Merge cells for the multi-row headers
              worksheet.mergeCells('L5:M5'); // "Articles"
              worksheet.mergeCells('N5:V5'); // "Informations Produits"
              worksheet.mergeCells('V6:V7'); // "Informations Produits"
              worksheet.mergeCells('N6:P6'); // "Gamme Produits"
              worksheet.mergeCells('Q6:S6'); // "Concurrent"
              worksheet.mergeCells('T6:T7'); // "Distributeur"
              worksheet.mergeCells('U6:U7'); // "Commentaire"
          
              worksheet.mergeCells('A5:A7');
              worksheet.mergeCells('B5:B7');
              worksheet.mergeCells('C5:C7');
              worksheet.mergeCells('D5:D7');
              worksheet.mergeCells('E5:E7');
              worksheet.mergeCells('F5:F7');
              worksheet.mergeCells('G5:G7');
              worksheet.mergeCells('L6:L7');
              worksheet.mergeCells('M6:M7');
              
              worksheet.mergeCells('H5:H7');
              worksheet.mergeCells('I5:I7');
              worksheet.mergeCells('J5:J7');
              worksheet.mergeCells('K5:K7')
          
              // Apply alignment to merged cells
              const mergeRanges = ['L5:M5','N5:V5','V6:V7','N6:P6','Q6:S6','T6:T7','U6:U7',
              'A5:A7','B5:B7','C5:C7','D5:D7','E5:E7','F5:F7','G5:G7','L6:L7','M6:M7', 
              'H5:H7','I5:I7','J5:J7','K5:K7'              ];
              // Center alignement 
              mergeRanges.forEach(range => {
                const [startCell] = range.split(':');
                const mergedCell = worksheet.getCell(startCell);
                mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
              });
          
              const safeSplit = (value) => {
                return value ? value.split(',').map(v => v.trim()).filter(v => v) : [];
              };
              
               
              for (const formulaire of groupedByWilaya[wilaya]) {
                const clientName = `${formulaire.nom_client} ${formulaire.prenom_client}`;
                console.log(clientName);
              
                app.use('/exports', express.static(path.join(__dirname, 'exports')));

           
                
                //split article in two nom , quantite
                const articlesResult = await pool.request()
                  .input('formId', sql.Int, formulaire.form_id)
                  .query(`
                    SELECT nom_article, quantite
                    FROM articles
                    WHERE id_form = @formId
                  `);
          
                const articles = articlesResult.recordset.map(article => ({
                  nom: article.nom_article,
                  quantite: article.quantite
                }));
                 
                const produitsLampe = safeSplit(formulaire.produitLampe);
                const produitsAppareillage = safeSplit(formulaire.produitAppareillage);
                const produitsDisjoncteur = safeSplit(formulaire.produitDisjoncteur);
                const concurrentsLampe = safeSplit(formulaire.concurrentLampe);
                const concurrentsAppareillage = safeSplit(formulaire.concurrentAppareillage);
                const concurrentsDisjoncteur = safeSplit(formulaire.concurrentDisjoncteur);
                const Fournisseur =safeSplit(formulaire.Distributeur);
    
                // Determine the maximum length of product/competitor lists
                const maxLength = Math.max(produitsLampe.length, produitsAppareillage.length, produitsDisjoncteur.length,
                                           concurrentsLampe.length, concurrentsAppareillage.length, concurrentsDisjoncteur.length,
                                           articles.length,Fournisseur.length);
          
                let startRow = worksheet.rowCount + 1;
                let endRow;
          
                // Create a row for each combination of products/competitors
                for (let i = 0; i < maxLength; i++) {
                  const link = `https://www.google.com/maps/place/${formulaire.latitude},${formulaire.longitude}`;
                  const row = worksheet.addRow([
                    formulaire.MissionObjective,
                    formulaire.Activite,
                    formulaire.daira,
                    formulaire.Commune,
                    formulaire.MissionDate,
                    formulaire.nom_magasin,
                    formulaire.nom_client,
                    formulaire.prenom_client,
                    formulaire.Tel,
                    formulaire.espacepub,
                    formulaire.plaque,
                    articles[i] ? articles[i].nom : '',
                    articles[i] ? articles[i].quantite : '',
                    produitsLampe[i] || '',
                    produitsAppareillage[i] || '',
                    produitsDisjoncteur[i] || '',
                    concurrentsLampe[i] || '',
                    concurrentsAppareillage[i] || '',
                    concurrentsDisjoncteur[i] || '',
                    Fournisseur[i] || '',
                    formulaire.commentaire,
                    formulaire.evaluecli
                  ]);
      
                  row.getCell(23).value = {
                    text: 'Voir dans Map',
                    hyperlink: link
                  };
                 
      
                
                  //add borders
                  row.eachCell({ includeEmpty: true }, (cell) => {
                    cell.border = {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      right: { style: 'thin' },
                      bottom: { style: 'thin' }
                    };
                  });
          
                  endRow = worksheet.rowCount;
                }
          
                // Merge cells for columns
                worksheet.mergeCells(`A${startRow}:A${endRow}`);
                worksheet.mergeCells(`B${startRow}:B${endRow}`);
                worksheet.mergeCells(`C${startRow}:C${endRow}`);
                worksheet.mergeCells(`D${startRow}:D${endRow}`);
                worksheet.mergeCells(`E${startRow}:E${endRow}`);
                worksheet.mergeCells(`F${startRow}:F${endRow}`);
                worksheet.mergeCells(`G${startRow}:G${endRow}`);
                worksheet.mergeCells(`H${startRow}:H${endRow}`);
                worksheet.mergeCells(`I${startRow}:I${endRow}`);
                worksheet.mergeCells(`J${startRow}:J${endRow}`);
                worksheet.mergeCells(`K${startRow}:K${endRow}`);
                
              
                worksheet.mergeCells(`U${startRow}:U${endRow}`);
                worksheet.mergeCells(`V${startRow}:V${endRow}`);
                worksheet.mergeCells(`W${startRow}:W${endRow}`);
          
                // Apply alignment to merged cells
                const mergedRanges = [
                  `A${startRow}:A${endRow}`,`W${startRow}:W${endRow}`, `B${startRow}:B${endRow}`, `C${startRow}:C${endRow}`,
                  `D${startRow}:D${endRow}`, `E${startRow}:E${endRow}`, `F${startRow}:F${endRow}`,
                  `G${startRow}:G${endRow}`, `H${startRow}:H${endRow}`, `Q${startRow}:Q${endRow}`,
                  `R${startRow}:R${endRow}`, `S${startRow}:S${endRow}`,`T${startRow}:T${endRow}`
                  ,`I${startRow}:I${endRow}`
                  ,`J${startRow}:J${endRow}`
                  ,`K${startRow}:K${endRow}`,`U${startRow}:U${endRow}`,`V${startRow}:V${endRow}`
                ];
          
                mergedRanges.forEach(range => {
                  const [startCell] = range.split(':');
                  const mergedCell = worksheet.getCell(startCell);
                  mergedCell.alignment = { vertical: 'middle', horizontal: 'center' };
                });
              }
               //apply width to cells
              worksheet.columns.forEach(column => {
                if (['Produit Lampe', 'Produit Appareillage', 'Produit Disjoncteur', 'Concurrent Lampe', 'Concurrent Appareillage', 'Concurrent Disjoncteur'].includes(column.header)) {
                  column.width = 60; 
                } else {
                  column.width = 30; 
                }
              });
            }
               //name of file with path
            const agent = result.recordset[0];
            const excelFilename = `Formulaires_${agent.nom_agent}_${agent.prenom_agent}.xlsx`;
            const excelFilePath = path.join(__dirname, 'exports', excelFilename);
          
            await workbook.xlsx.writeFile(excelFilePath);
          
            res.download(excelFilePath, excelFilename, (err) => {
              if (err) {
                console.error('Erreur lors du téléchargement du fichier Excel :', err.message);
                res.status(500).send('Erreur interne du serveur lors du téléchargement du fichier Excel');
              } else {
                fs.unlinkSync(excelFilePath);
              }
            });
          } else {
            res.status(404).send('Aucun formulaire trouvé pour cet agent');
          }
      } catch (err) {
        console.error('Erreur de récupération des détails du formulaire pour Excel :', err.message);
        res.status(500).send('Erreur interne du serveur');
      }
    });





app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//SEnd response  WHEN YOU TAP /
app.get('/', async (req, res) => {
  const societe = req.session.societe;
  const username = req.session.username || "";
  const role = req.session.role || "";
  let photo = `user.PNG`; // Default photo path
  let iduse = null;

  if (username) {
    try {
      const pool = await sql.connect(bd);

      // Use a parameterized query to prevent SQL injection
      const result = await pool.request()
        .input('username', sql.VarChar, username)
        .query('SELECT * FROM utilisateur WHERE username = @username');

      if (result.recordset.length > 0) {
        const user = result.recordset[0];
        photo = user.photo || `user.PNG`; 
         iduse=user.id
        console.log(user.id);
      
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des données de l\'utilisateur:', err.message);
      res.status(500).send('Erreur interne du serveur');
      return;
    }
  }

  // Render the index page with the user data
  res.render('index', {
    username,
    role,
    societe,
    photo,
   iduse
  });
});


//SEND RESPONSE WHEN YOU TAP THIS
app.get('/dashboardcontact', async (req, res) => {
if (req.session.role !== 'admin') {
return res.redirect('/');
}

try {
  //collecter nombre de page
const page = parseInt(req.query.page) || 1;
const perPage = parseInt(req.query.perPage) || 50; //50 PAR PAGE
const search = req.query.search || '';

const pool = await sql.connect(bd);


const countResult = await pool.request()
  .query(`SELECT COUNT(*) AS totalCount FROM contact`);

const totalCount = countResult.recordset[0].totalCount;
const offset = (page - 1) * perPage;

let searchCondition = '';


if (search !== '') {
  searchCondition = `
    WHERE 
    nom LIKE '${search}%' OR
          prenom LIKE '${search}%' OR
          message LIKE '${search}%'
  `;
}

const result = await pool.request()
  .query(`
    SELECT nom, prenom, message,username
    FROM contact
    ${searchCondition}
    ORDER BY id
    OFFSET ${offset} ROWS FETCH NEXT ${perPage} ROWS ONLY
  `);

if (result.recordset.length === 0) {
  res.render('dashboardcontact', {
    contacts: result.recordset,
    page,
    perPage,
    totalCount,
    message: 'Aucun résultat trouvé pour la recherche : ' + search
  });
} else {
  //ENVOYER LES DONNES VERS DASHBOARDCONTACT
  res.render('dashboardcontact', {
    contacts: result.recordset,
    page,
    perPage,
    totalCount
  });
}
} catch (err) {
console.error("Erreur de récupération des données:", err.message);
res.status(500).send('Erreur interne du serveur');
}
});
app.get('/rapports', async (req, res) => {
  let pool;
  try {
      
      pool = await sql.connect(bd);


      const query = 'SELECT * FROM reclamation r ORDER BY r.id';
      const result = await pool.request().query(query);

      // Render the results
      res.render('StatusBL', {
          reclamations: result.recordset,
      });
  } catch (err) {
      console.error('SQL error', err);
     
      res.status(500).send('Internal Server Error');
  } finally {
     
      if (pool) {
          pool.close();
      }
  }
});

app.post('/update-status/:id/:newStatus', async (req, res) => {
  const { id, newStatus } = req.params;

  try {
      const pool = await sql.connect(bd);
      await pool.request()
          .input('id', sql.Int, id)
          .input('status', sql.NVarChar, newStatus)
          .query('UPDATE reclamation SET status = @status WHERE id = @id');

      res.redirect('/rapports'); 
  } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la mise à jour du statut');
  }
});




app.get('/dashboard', async (req, res) => {
if (req.session.role !== 'admin' && req.session.role !== 'responsable') {
  return res.redirect('/');
}

try {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 50;

  const search = req.query.search || '';
  const societe = req.session.societe || ''; 
  const role = req.session.role || ''; 

  const pool = await sql.connect(bd);
  let baseQuery = `
    SELECT u.nom AS nom_agent, u.prenom AS prenom_agent, u.id AS agent_id,u.telephone AS telephone,u.societe AS society,
            MIN(f.id) AS id
    FROM formulaire f
    JOIN utilisateur u ON f.utilisateur_id = u.id
  `;

  let whereClause = 'WHERE 1=1';
  if((role === 'responsable' && (societe === 'bms' || societe === 'mono'))) {
    whereClause += ` AND u.societe = '${societe}'`;
  }

  if (search !== '') {
    whereClause += `
      AND (
        u.nom LIKE '${search}%' OR
        u.prenom LIKE '${search}%' 
        u.societe LIKE '${search}'
      )
    `;
  }

  const groupByClause = `
    GROUP BY u.nom, u.prenom, u.id,u.telephone,u.societe
  `;

  const countQuery = `
    SELECT COUNT(*) AS totalCount
    FROM (
      SELECT u.nom, u.prenom,u.telephone,u.societe
      FROM formulaire f
      JOIN utilisateur u ON f.utilisateur_id = u.id
      ${whereClause}
      ${groupByClause}
    ) AS grouped
  `;
  const countResult = await pool.request().query(countQuery);
  const totalCount = countResult.recordset[0].totalCount;
  const offset = (page - 1) * perPage;

  const resultQuery = `
    ${baseQuery}
    ${whereClause}
    ${groupByClause}
    ORDER BY u.nom, u.prenom,u.telephone,u.societe
    OFFSET ${offset} ROWS FETCH NEXT ${perPage} ROWS ONLY
  `;
  const result = await pool.request().query(resultQuery);

  res.render('dashboard', {
    formulaires: result.recordset,
    role,
    page,
    perPage,
    totalCount,
    message: result.recordset.length === 0 ? `Aucun résultat trouvé pour la recherche : ${search}` : ''
  });
} catch (err) {
  console.error("Erreur de récupération des données:", err.message);
  res.status(500).send('Erreur interne du serveur');
}
});


//SEND WHEN YOU TAP /FORM
app.get('/form', (req, res) => {
if (req.session.username) {
  //COLLECTER INFO SESSION FROM LOG IN 
  const societe = req.session.societe;
  const agents = req.session.agent;
 
  console.log(agents);
  const regions = new Set();
  let sourcesApprovisionnement = {};
  
  if (societe) {
    const filePath = path.join(__dirname, `client${societe.toUpperCase()}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      data.forEach(item => regions.add(item.region));
      data.forEach(item => {
        if (!sourcesApprovisionnement[item.region]) {
          sourcesApprovisionnement[item.region] = [];
        }
        sourcesApprovisionnement[item.region].push(item.nom);
      });
    }
  }
  
  res.render('form', {
    societe,
    regions: Array.from(regions),
    sourcesApprovisionnement,
    agents
  });
} else {
  res.send(`
    <script>
      alert("Vous devez d'abord vous connecter.");
      window.location.href = "/login";
    </script>
  `);
}
});

app.get("/wilayas", async (req, res) => {
  const term = req.query.term || '';
    console.log(`Début de la requête /wilayas avec le terme: ${term}`);
 
  try {
      console.log("Connexion à la base de données...");
      await sql.connect(bd);
      console.log("Connexion réussie !");
      console.log("Exécution de la requête SQL...");
      const result = await sql.query`SELECT DISTINCT wilaya FROM algeriacities WHERE wilaya LIKE ${term + '%'}`;
      console.log('Données obtenues:', result.recordset);
      res.json(result.recordset);
  } catch (error) {
      console.error("Erreur lors de la récupération des wilayas:", error.message);
      res.status(500).send("Erreur du serveur");
  }
});

app.get("/Daira/:wilaya", async (req, res) => {
  const term = req.query.term || '';
  const wilaya = req.params.wilaya || '';
  console.log(`Début de la requête /daira/${wilaya}`);
  try {
    console.log("Connexion à la base de données...");
    await sql.connect(bd);
    console.log("Connexion réussie !");
    console.log("Exécution de la requête SQL...");
    const result = await sql.query`SELECT DISTINCT daira FROM algeriacities WHERE wilaya = ${wilaya} and daira LIKE ${term + '%'} `;
    console.log('Données obtenues:', result.recordset);
    res.json(result.recordset);
  } catch (error) {
    console.error("Erreur lors de la récupération des dairas:", error.message);
    res.status(500).send("Erreur du serveur");
  }
});
app.get('/commune/:wilaya/:daira', async (req, res) => {
  const term = req.query.term || '';
  const wilaya = req.params.wilaya || '';
  const daira = req.params.daira || '';
  
  console.log(`Début de la requête /commune/${wilaya}/${daira}`);
  try {
      console.log("Connexion à la base de données...");
      await sql.connect(bd);
      console.log("Connexion réussie !");
      console.log("Exécution de la requête SQL...");
      const result = await sql.query`SELECT DISTINCT commune FROM algeriacities WHERE wilaya = ${wilaya} AND daira = ${daira} AND commune LIKE ${term + '%'} `;
      console.log('Données obtenues:', result.recordset);
      res.json(result.recordset);
  } catch (error) {
      console.error("Erreur lors de la récupération des communes:", error.message);
      res.status(500).send("Erreur du serveur");
  }
});










//POUR FAIRE LE CHOIX ENTRE QUEL FICHIERS CHOISIS ET FILTRER PAR REGION  ET SOCIETE
app.get('/sources', (req, res) => {
const { societe, region } = req.query;
let sourcesApprovisionnement = [];

if (societe && region) {
  const filePath = path.join(__dirname, `client${societe.toUpperCase()}.json`);
  if (fs.existsSync(filePath)) {
    //READ FICHIER JSON
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    sourcesApprovisionnement = data
      .filter(item => item.region === region)
      .flatMap(item => item.nom); 
  }
}

res.json(sourcesApprovisionnement);
});



app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

app.get('/agent/forms', async (req, res) => {
  if (req.session.username) {
      const { year, month } = req.query; // Obtenez les paramètres de l'année et du mois
      
      try {
          const pool = await sql.connect(bd);
          let query = 'SELECT Nom, Prenom, pdfPath, [MissionDate] FROM formulaire WHERE utilisateur_id = @userId AND pdfPath IS NOT NULL';
          let parameters = { userId: req.session.userId };

          if (year && month) {
              query += ' AND YEAR([MissionDate]) = @year AND MONTH([MissionDate]) = @month';
              parameters.year = parseInt(year);
              parameters.month = parseInt(month);
          }
          const id=req.session.userId;
          const result = await pool.request()
              .input('userId', sql.Int, parameters.userId)
              .input('year', sql.Int, parameters.year)
              .input('month', sql.Int, parameters.month)
              .query(query);

          // Collecter les données pour afficher la page
          const forms = await Promise.all(result.recordset.map(async form => {
              const qrData = `${form.Nom}, ${form.Prenom}`;
              const qrCodeUrl = await qrcode.toDataURL(qrData);

              return {
                  Nom: form.Nom,
                  Prenom: form.Prenom,
                  pdfFilename: path.basename(form.pdfPath), 
                  qrCodeUrl 
              };
          }));

          res.render('agentForms', { forms, selectedYear: year, selectedMonth: month ,id});
      } catch (err) {
          console.error("Erreur lors de la récupération des formulaires:", err.message);
          res.status(500).send("Erreur lors de la récupération des formulaires.");
      } finally {
          sql.close();
      }
  } else {
      res.send(`
          <script>
              alert("Vous devez d'abord vous connecter.");
              window.location.href = "/form";
          </script>
      `);
  }
});
//collecter les info from formulaire

app.post('/form', async (req, res) => {
const userId = req.session.userId;
const {
  missionObjective,
  date,
  wilaya,
  commune,
  daira,
  activite,
  nom,
  prenom,
  tel,
  email,
  nom_ach,
  espacepub,
  Distributeur,
  produitLampe,
  produitAppareillage,
  produitDisjoncteur,
  concurrentLampe,
  concurrentAppareillage,
  concurrentDisjoncteur,
  evaluecli,
  evalueBms,
  evaluconcurrent,
  commentaire,
  longitude,
  latitude,
  nom_magasin,
  region,
  plaque,
  articles
} = req.body;
   console.log(req.body);
try {
  //stocker les donnes dune liste a multichoix dans un array separer par de virgule
  const pool = await sql.connect(bd);
  const produitstrlampe = Array.isArray(produitLampe) ? produitLampe.join(', ') : produitLampe;
  const produitstrappareillage = Array.isArray(produitAppareillage) ? produitAppareillage.join(', ') : produitAppareillage;
  const produitstrdisjoncteur = Array.isArray(produitDisjoncteur) ? produitDisjoncteur.join(', ') : produitDisjoncteur;
  const concurrentstrlampe = Array.isArray(concurrentLampe) ? concurrentLampe.join(', ') : concurrentLampe;
  const concurrentstrappareillage = Array.isArray(concurrentAppareillage) ? concurrentAppareillage.join(', ') : concurrentAppareillage;
  const concurrentstrdisjoncteur = Array.isArray(concurrentDisjoncteur) ? concurrentDisjoncteur.join(', ') : concurrentDisjoncteur;

  const sqlq = `
    INSERT INTO formulaire (
      utilisateur_id, MissionObjective, MissionDate, Wilaya, Commune,region, daira,email,nom_ach,plaque,espacepub, Activite,longitude,latitude,
     Nom,Prenom,Tel,nom_magasin, Distributeur, produitLampe, produitAppareillage, produitDisjoncteur, concurrentLampe, concurrentAppareillage, concurrentDisjoncteur, evaluecli, evalueBms, evaluconcurrent,commentaire
    )OUTPUT INSERTED.id
     VALUES (
      @userId, @missionObjective, @date, @wilaya, @commune,@region,@daira,@email,@nom_ach,@espacepub,@plaque,
      @activite,@longitude,@latitude, @nom, @prenom, @tel,@nom_magasin, @Distributeur, @produitLampe, @produitAppareillage, @produitDisjoncteur, @concurrentLampe, @concurrentAppareillage, @concurrentDisjoncteur, @evaluecli, @evalueBms, @evaluconcurrent,@commentaire
    )
  `;
   //declarer les variable apres l'insertion
  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .input('missionObjective', sql.VarChar, missionObjective)
    .input('date', sql.Date, date)
    .input('wilaya', sql.VarChar, wilaya)
    .input('commune', sql.VarChar, commune)
    .input('daira', sql.VarChar, daira)
    .input('email', sql.VarChar, email)
    .input('nom_ach', sql.VarChar, nom_ach)
    .input('espacepub', sql.VarChar, espacepub)
    .input('plaque', sql.VarChar, plaque)
    .input('region', sql.VarChar, region)
    .input('activite', sql.VarChar, activite)
    .input('nom', sql.VarChar, nom)
    .input('prenom', sql.VarChar, prenom)
    .input('tel', sql.VarChar, tel)
    .input('nom_magasin', sql.VarChar, nom_magasin)
    .input('Distributeur', sql.VarChar, Distributeur)
    .input('produitLampe', sql.VarChar, produitstrlampe)
    .input('produitAppareillage', sql.VarChar, produitstrappareillage)
    .input('produitDisjoncteur', sql.VarChar, produitstrdisjoncteur)
    .input('concurrentLampe', sql.VarChar, concurrentstrlampe)
    .input('concurrentAppareillage', sql.VarChar, concurrentstrappareillage)
    .input('concurrentDisjoncteur', sql.VarChar, concurrentstrdisjoncteur)
    .input('evaluecli', sql.VarChar, evaluecli)
    .input('evalueBms', sql.Float, evalueBms)
    .input('evaluconcurrent', sql.Float, evaluconcurrent)
    .input('commentaire', sql.VarChar, commentaire)
    .input('longitude', sql.VarChar, longitude)
    .input('latitude', sql.VarChar, latitude)
    .query(sqlq);
    const formId = result.recordset[0].id;
   
console.log('Inserted form ID:', formId); 
 //CRERE OBJET POUR STOCKER NOM ,QUANTITE D'ARTICLES
const articles = [];
for (const key in req.body) {
  if (key.endsWith('Quantity') && req.body[key]) {
    articles.push({
      name: key.replace('Quantity', ''),
      quantity: req.body[key]
    });
  }
}
// inserer ces donnes collecter a une autre table articles
if (articles.length > 0) {
  for (const article of articles) {
    const sqlArticle = `
      INSERT INTO articles (id_form, nom_article, quantite)
      VALUES (@formId, @name, @quantity)
    `;
    await pool.request()
      .input('formId', sql.Int, formId)
      .input('name', sql.VarChar, article.name)
      .input('quantity', sql.Int, article.quantity)
      .query(sqlArticle);
  }
}
   
  //besoin de pdf nom,path
  let pdfFilename = `${nom}_${prenom}_form_${date}.pdf`;
  let pdfPath = path.join(__dirname, 'pdfs', pdfFilename);
  let counter = 1;
    //sil existe ce nom deja faire un incrementation 
  while (fs.existsSync(pdfPath)) {
    pdfFilename = `${nom}_${prenom}_form_${date}_${counter}.pdf`;
    pdfPath = path.join(__dirname, 'pdfs', pdfFilename);
    counter++;
  }
  //construire pdf

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));
   //donnes qr code

  const googleMapsUrl = `https://www.google.com/maps/place/${latitude},${longitude}`;
  const qrData = `
     Nom: ${nom}
     Prenom: ${prenom}
     Wilaya: ${wilaya}
     Telephone: ${tel}
     Localisation: ${googleMapsUrl}`;
    console.log(qrData)
    //path qrcode
  const qrCodePath = path.join(__dirname, 'qrcodes', `${nom} ${prenom}.png`);
  await qrcode.toFile(qrCodePath, qrData);
  //style qr code
  doc.fontSize(16).fillColor('black').text(`Rapport De Formulaire`,{align:'center',underline:true});
  doc.moveDown(2);
  doc.fontSize(12).fillColor('black').text(`Objectif: ${missionObjective}`, { align: 'left', continued: true })
  .text(`LE: ${date}`, { align: 'right' });
  doc.moveDown(2);

  
  doc.fontSize(12).fillColor('black').text(`QR de client:`, { align: 'right' });
  doc.moveDown(1);
  
  //POSITIONS
  const qrCodeX = doc.page.width - doc.page.margins.right - 100; 
  const qrCodeY = doc.y;
  
  //image de qrcodes
  doc.image(qrCodePath, qrCodeX, qrCodeY, { width: 100, height: 100 });

  const addTextWithStyledTitle = (title, value, titleColor = 'blue') => {
    if (value && value.trim() !== '') {
      doc.fontSize(12).fillColor(titleColor).text(`${title}:`, { continued: true });
      doc.fillColor('black').text(` ${value}`);
      doc.moveDown(1);
    }
  };

  const addListWithStyledTitle = (title, itemsStr, titleColor = 'blue') => {
    if (itemsStr && itemsStr.trim() !== '') {
      doc.fontSize(12).fillColor(titleColor).text(`${title}:`);
      doc.moveDown(0.5);
      const items = itemsStr.split(',');
      items.forEach(item => {
        doc.fontSize(12).fillColor('black').text(`- ${item.trim()}`, { indent: 20 });
      });
      doc.moveDown(1);
    }
  };
  addTextWithStyledTitle('Region', region);
  addTextWithStyledTitle('Wilaya', wilaya);
  addTextWithStyledTitle('daira', daira);

  addTextWithStyledTitle('Commune', commune);
  addTextWithStyledTitle('NomClient', nom);
  addTextWithStyledTitle('PrenomClient', prenom);
  addTextWithStyledTitle('Telephone', tel);
  addTextWithStyledTitle('Email', email);
  addTextWithStyledTitle('Nom_Magasin', nom_magasin);
  addTextWithStyledTitle('Nom_Acheteur / Gerant', nom_ach);
  addTextWithStyledTitle('Activite', activite);
  addListWithStyledTitle('Source de client ', Distributeur);
  addTextWithStyledTitle('Espace publicitaire ', espacepub);
  
  doc.fontSize(12).fillColor('blue').text(`Articles distribués:`);
  doc.moveDown(0.5);
  articles.forEach(article => {
    doc.fontSize(12).fillColor('black').text(`- ${article.name}: ${article.quantity}`, { indent: 20 });
  });
  // MARGIN BOTTOM
  doc.moveDown(2);
  //BARE HORIZONTAL DOTTED
  doc.dash(5, { space: 5 });
  doc.moveTo(doc.page.margins.left, doc.y)
  .lineTo(doc.page.width - doc.page.margins.right, doc.y)
  .stroke();
    doc.undash();
    doc.moveDown(2);
  addListWithStyledTitle('Produit disponible dans lampes', produitstrlampe);
  addListWithStyledTitle('Produit disponible dans Appareillage', produitstrappareillage);
  addListWithStyledTitle('Produit disponible dans Disjoncteur', produitstrdisjoncteur);
  addListWithStyledTitle('Concurrent disponible dans Lampe', concurrentstrlampe);
  addListWithStyledTitle('Concurrent Appareillage', concurrentstrappareillage);
  addListWithStyledTitle('Concurrent Disjoncteur', concurrentstrdisjoncteur);
  doc.dash(5, { space: 5});
  doc.moveTo(doc.page.margins.left, doc.y)
  .lineTo(doc.page.width - doc.page.margins.right, doc.y)
  .stroke();
  doc.undash();
  const marginBottom = 20; 
   doc.moveDown(marginBottom / doc.currentLineHeight(true))
  addTextWithStyledTitle('Evaluation Client', evaluecli);
  addTextWithStyledTitle('Evaluation BMS', evalueBms);
  addTextWithStyledTitle('Evaluation Concurrent', evaluconcurrent);
  addTextWithStyledTitle('Réclamation', commentaire);

 // fin de pdf
  doc.end();

  console.log("PDF Path:", pdfPath);

  await pool.request()
    .input('userId', sql.Int, userId)
    .input('pdfPath', sql.VarChar, pdfPath)
    .query(`UPDATE formulaire SET pdfPath = @pdfPath WHERE utilisateur_id = @userId AND pdfPath IS NULL`);

  
  res.render('pdfs', { pdfPath: `/pdfs/${pdfFilename}` });

} catch (err) {
  console.error("Erreur d'insertion de données:", err.message);
  res.send(`
    <script>
      alert("Désolé, une erreur est survenue lors de l'insertion du formulaire.");
      window.location.href = "/";
    </script>
  `);
} finally {
  sql.close();
}
});


app.get('/contact', (req, res) => {
res.sendFile(path.join(__dirname, 'contact.html'));
});

app.post('/contact', async (req, res) => {
const { nom, prenom, message,username } = req.body;

try {
const con = await sql.connect(bd);
const sqlq = `INSERT INTO contact (nom, prenom, message,username) VALUES (@nom, @prenom, @message,@username)`;
await con.request()
  .input('nom', sql.VarChar, nom)
  .input('prenom', sql.VarChar, prenom)
  .input('message', sql.VarChar, message)
  .input('username', sql.VarChar, username)
  .query(sqlq);

res.send(`
<script>
alert("Message envoyé pour ${nom}  ${prenom}.");
window.location.href = "/";
 </script>
`);
} catch (err) {
console.error("Erreur d'insertion de données:", err.message);
res.status(500).send(`
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Erreur d'insertion</title>
      <style>
        body {
          height: 100vh;
          width: 80%;
          background: linear-gradient(rgb(255, 255, 255, 1) 0%, rgba(251, 251, 251, 0.1) 100%), linear-gradient(90deg, #84d2ff, #8d5acd);
          background-attachment: fixed;
          background-size: cover;
        }
        h2, p {
          text-align: center;
        }
        h2 {
          margin-bottom: 15px;
        }
      </style>
    </head>
    <body>
      <p>Désolé, une erreur est survenue lors de l'insertion.</p>
      <p>Erreur: ${err.message}</p>
    </body>
  </html>
`);
} finally {
sql.close();
}
});
// Route pour afficher le profil
app.get('/profile', async (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login');
  }

  try {
    const pool = await sql.connect(bd);
    const result = await pool.request()
      .input('username', sql.VarChar, req.session.username)
      .query('SELECT * FROM utilisateur WHERE username = @username');

    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.render('profile', {user});
   
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error("Erreur lors de l'affichage du profil:", err.message);
    res.status(500).send('Erreur interne du serveur');
  }
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Répertoire où les photos seront stockées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom du fichier avec horodatage
  }
});

const upload = multer({ storage });

// Route pour télécharger la photo de profil
app.post('/upload-profile-photo', upload.single('profile-photo'), async (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login');
  }

  const photoPath = req.file.filename;
  const username = req.session.username;

  try {
    const pool = await sql.connect(bd);
    await pool.request()
      .input('username', sql.VarChar, username)
      .input('photo', sql.VarChar, photoPath)
      .query('UPDATE utilisateur SET photo = @photo WHERE username = @username');

    res.redirect('/profile');
  } catch (err) {
    console.error("Erreur lors du téléchargement de la photo de profil:", err.message);
    res.status(500).send('Erreur interne du serveur');
  }
});
// Route pour mettre à jour le profil
app.post('/update-profile', async (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login');
  }

  const { telephone, email, nom, prenom } = req.body;
  const username = req.session.username;

  try {
    const pool = await sql.connect(bd);
    await pool.request()
      .input('username', sql.VarChar, username)
      .input('telephone', sql.VarChar, telephone)
      .input('email', sql.VarChar, email)
      .input('nom', sql.VarChar, nom)
      .input('prenom', sql.VarChar, prenom)
      .query('UPDATE utilisateur SET telephone = @telephone, email = @email, nom = @nom, prenom = @prenom WHERE username = @username');

    res.redirect('/profile');
  } catch (err) {
    console.error("Erreur lors de la mise à jour du profil:", err.message);
    res.status(500).send('Erreur interne du serveur');
  }
});

// SEND RESPONSE WHEN YOU TAP /SIGNUP == VOUS TRANSFERER A CETTE PAGE
app.get('/signup', (req, res) => {
res.sendFile(path.join(__dirname, '/signup.html'));
});

//QUAND TU VISITE LA PAGE ?JE COLLECTE LES INFO SAISIS
app.post('/signup', async (req, res) => {
const {societe,telephone,agent,username, nom,email, prenom, password,confirmPassword } = req.body;
if (societe.toLowerCase() !== 'bms' && societe.toLowerCase() !== 'mono') {
return res.send(`
  <script>
    alert("La valeur de société doit être 'bms' ou 'mono'.");
    window.location.href = "/signup";
  </script>
`);
}
if (password !== confirmPassword) {
return res.send(`
  <script>
    alert("Les mots de passe ne correspondent pas.");
    window.location.href = "/signup";
  </script>
`);
}
// HASHER PASSWORD AVEC 10
const hashedPassword = await bcrypt.hash(password, 10);

try {
  //atender connection a bd
const pool = await sql.connect(bd);

// FAIRE DES REQUEST AU BASE DE DONNES
const result = await pool.request()
  .input('username', sql.VarChar, username)
  .query('SELECT * FROM utilisateur WHERE username = @username');

if (result.recordset.length > 0) {
  // SI DEJA RESULT RECORDEST CONTIENT UNE CHAINE CA VEUT DIRE QUE IL EXISTE CE USERNAME
  res.send(`
    <script>
      alert("Le nom d'utilisateur ${username} est déjà pris.");
      window.location.href = "/signup";
    </script>
  `);
} else {
  //SINON inserer le new user
  const sqlq = `INSERT INTO utilisateur (societe,agent,telephone,username,email, nom, prenom, password) VALUES (@societe,@agent,@telephone,@username,@email, @nom, @prenom, @password)`;
  await pool.request()
  .input('societe',sql.VarChar,societe)
    .input('username', sql.VarChar, username)
    .input('nom', sql.VarChar, nom)
    .input('prenom', sql.VarChar, prenom)
    .input('agent', sql.VarChar, agent)
    .input('telephone', sql.VarChar, telephone)
    .input('password', sql.VarChar, hashedPassword)
    .input('email', sql.VarChar, email)
    .query(sqlq);

  res.send(`
    <script>
      alert("Inscription réussie pour ${username}.");
      window.location.href = "/login";
    </script>
  `);
}
} catch (err) {
console.error("Erreur d'insertion de données:", err.message);
res.send(`
    <script>
      alert("erreur d'inscription pour ${username}.");
      window.location.href = "/signup";
    </script>
  `);
} finally {
sql.close();
}
});

// EN CAS DERREUR COLLECTER LERREUR ET LENVOYER
app.get('/login', (req, res) => {
 
const error = req.query.error || "";
res.render("login",{error});
});

//COLLECTER INFO FROM LOGIN
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
  const pool = await sql.connect(bd);
  const result = await pool.request()
    .input('username', sql.VarChar, username)
    .query('SELECT * FROM utilisateur WHERE username = @username');
  
  if (result.recordset.length > 0) {
    const user = result.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    if (passwordMatch) {
      // SI PASSWORD MATCH SAUVEGARDER LE USERID ; USERNAME , role,societe ,region,type dagent commercial ou marketing
     id= req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.roles;
      req.session.societe = user.societe;
      req.session.agent=user.agent;
     
      console.log("user session=" + req.session.username );
      console.log("role="+req.session.role);
      if (user.roles === 'admin') {
        res.redirect('/');
      } else  {
        if(user.roles==='responsable'){
        res.redirect('/');}
        else{
          if(user.username==='YacineMed'){
            res.redirect('/');}
          else{
          res.redirect('/form')
        }
        }
      }
      
    } else {
      res.redirect('/login?error=Nom d\'utilisateur ou mot de passe incorrect');
    }
  } else {
    res.redirect('/login?error=Nom d\'utilisateur ou mot de passe incorrect');
  }
  } catch (err) {
  console.error("Erreur de connexion:", err.message);
  res.status(500).send('Erreur interne du serveur');
  }
  });

//QUAND TU LOG OUT DESTROY SESSION
app.get('/logout', (req, res) => {
req.session.destroy((err) => {
if (err) {
  console.error('Error destroying session:', err);
  return res.redirect('/');
}
//CREER COOKIE QUAND TU CREER SESSION APRES TU LES CLEAR AU LOGOUT
res.clearCookie('connect.mono');
res.redirect('/');
});
});
//POUR LANCER LE SERVER 
app.listen(port,() => {
  console.log(`Serveur démarré sur localhost:${port}`);
});
