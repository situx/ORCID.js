/**
 * Created by michaelcrabb on 05/03/2017.
 */

var publicationsperYear={}
var peerReviewsPerYear={}
var fundingPerYear={}

function createORCIDProfile(orcidID, elementID,fromYear,toYear) {
       var   publicationsPerYear={}
  var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/works";

  fetch(ORCIDLink,

      {
        headers: {
          "Accept": "application/orcid+json"
        }
      })
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {

          ////DEBUG!
          // console.log(data);

          var output = "";

          for (var i in data.group) {
          var outputJSON={}

             
            //PUBLICATION YEAR
            if (data.group[i]["work-summary"]["0"]["publication-date"] != null) {
              var publicationYear = data.group[i]["work-summary"]["0"]["publication-date"].year.value;
              outputJSON["year"]=data.group[i]["work-summary"]["0"]["publication-date"].year.value;
            } else {
              var publicationYear = "";
            }
                            console.log(publicationYear+" - "+fromYear+" - "+toYear)
            if(publicationYear!="" && (publicationYear<fromYear || publicationYear>toYear)){
                continue;
            }
             //PAPER NAME
            if (data.group[i]["work-summary"]["0"].title.title.value != null) {
              var publicationName = data.group[i]["work-summary"]["0"].title.title.value;
              outputJSON["title"]=data.group[i]["work-summary"]["0"].title.title.value;
            }
            //PUBLICATION TYPE
            
            if (data.group[i]["work-summary"]["0"].type != null) {
              var publicationName = data.group[i]["work-summary"]["0"].type;
              outputJSON["type"]=data.group[i]["work-summary"]["0"].type;
            }

            //PUBLICATION MONTH
            if (data.group[i]["work-summary"]["0"]["publication-date"] != null && data.group[i]["work-summary"]["0"]["publication-date"].month!=null ) {
              var publicationMonth = data.group[i]["work-summary"]["0"]["publication-date"].month.value;
              outputJSON["month"]=data.group[i]["work-summary"]["0"]["publication-date"].month.value;
            } else {
              var publicationMonth = "";
            }

            //PUBLICATION DAY
            if (data.group[i]["work-summary"]["0"]["publication-date"] != null && data.group[i]["work-summary"]["0"]["publication-date"].day!=null ) {
              var publicationDay = data.group[i]["work-summary"]["0"]["publication-date"].day.value;
              outputJSON["day"]=data.group[i]["work-summary"]["0"]["publication-date"].day.value;
            } else {
              var publicationDay = "";
            }
            
            //DOI REFERENCE
            if (data.group[i]["external-ids"]["external-id"]["length"] != 0) {
              for (var j in data.group[i]["external-ids"]["external-id"]) {
                if (data.group[i]["external-ids"]["external-id"][j]["external-id-type"] == 'doi') {
                  var doiReference = data.group[i]["external-ids"]["external-id"][j]["external-id-value"];
                  outputJSON["doi"]=doiReference;
                  break;
                }
              }
            } else {
              var doiReference = "";
            }

          var bibtex=""
          //console.log(data)
          /*if (data.group[i]["work-summary"]["0"]["citation"]!=null && data.group[i]["work-summary"]["0"]["citation"]["citation-value"] != null) {
            var bibtex = data.group[i]["work-summary"]["0"]["citation"]["citation-value"];
            outputJSON["bibtex"]=data.group[i]["work-summary"]["0"]["citation"]["citation-value"];
          } else {
            var bibtex = "";
          }*/
            
            //JOURNAL NAME
            var putcode = data.group[i]["work-summary"]["0"]["put-code"];
            //console.log(journalTitle);
            /*output=""
            output += "<p><span id='publication_" + i + "'><strong>" + publicationName + "</strong>";
            output += " (" + publicationYear + ") </em></span>";
            output += " (" + publicationYear +" - "+ publicationMonth+" - "+publicationDay+") </em></span>";
            output += " <a href='https://doi.org/" + doiReference + "'> " + doiReference + "</a>"
            output += bibtex+"</p>";*/
            
            getJournalTitle(orcidID, putcode, i,outputJSON,elementID);
              
        }

        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

numberToMonth={"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"}

function getJournalTitle(orcidID, journalID, i,outputJSON,elementID) {
  var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/work/" + journalID;
  fetch(ORCIDLink, {
      headers: {
        "Accept": "application/orcid+json"
      }
    })
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(data) {
            console.log("Journal Query: ")
            console.log(data)
          if (data["journal-title"] != null) {
            var output = data["journal-title"].value;
            outputJSON["journal-title"]=data["journal-title"].value
            //document.getElementById("publication_" + i).innerHTML = document.getElementById("publication_" + i).innerHTML + output;
          }
          if (data["citation"] != null && data["citation"]["citation-value"]!=null) {
            var output = data["citation"]["citation-value"]
            outputJSON["bibtex"]=data["citation"]["citation-value"]
            //document.getElementById("publication_" + i).innerHTML = document.getElementById("publication_" + i).innerHTML + output;
          }
          if("bibtex" in outputJSON){
            bibtexJSON=bibtexParse.toJSON(outputJSON["bibtex"]);
            console.log("BIBTEXJSON")
            console.log(bibtexJSON)
            outputJSON["abstract"]=bibtexJSON[0]["entryTags"]["abstract"]
            outputJSON["author"]=bibtexJSON[0]["entryTags"]["author"]
            outputJSON["url"]=bibtexJSON[0]["entryTags"]["url"]
            outputJSON["address"]=bibtexJSON[0]["entryTags"]["address"]
            outputJSON["language"]=bibtexJSON[0]["entryTags"]["language"]
          }
          publicationYear=outputJSON["year"]
            console.log("OUTPUTJSON: ")
            console.log(outputJSON)
           if(!(publicationYear in publicationsperYear)){
                publicationsperYear[publicationYear]=[]                            
            }
            publicationsperYear[publicationYear].push(outputJSON)
            console.log(publicationsperYear)
            console.log(outputJSON)
            toadd=""
  years=Object.keys(publicationsperYear).sort().reverse()
  for(yearr in years){
        year=years[yearr]
        console.log(year)
        toadd+="<div class=\"publication_group_whole\" id=\"group_"+year+"\">"
        toadd+="<div class=\"publication_group\" onclick=\"toggleGroup('group_"+year+"')\" onkeypress=\"toggleGroup('group_"+year+"')\" tabindex=\"0\"><i class=\"fa fa-angle-down publication_group_head_icon\"></i>&nbsp;"
        console.log(publicationsperYear[year])
        toadd+="<span>"+year+"</span>&nbsp;<span class=\"publication_group_count\">("+publicationsperYear[year].length+")</span></div>"
        for(pub in publicationsperYear[year]){
            toadd+="<div class=\"publication_paper\" id=\"homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019\"><span class=\"publication_paper_titleauthoryear\">"
            toadd+=publicationsperYear[year][pub]["type"]+"&nbsp;<span class=\"publication_paper_title\"><a href=\"http://doi.org/"+publicationsperYear[year][pub]["doi"]+"\" onclick=\"return trackOutboundLink('publications', 'click', 'homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019', '//bibbase.org/network/publication/homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019');\">"
            toadd+="<b>"+publicationsperYear[year][pub]["title"]+"</b></a></span>&nbsp;<span class=\"publication_paper_author\">"+publicationsperYear[year][pub]["author"]+"</span>&nbsp;</span>In <i>"+publicationsperYear[year][pub]["journal-title"]+", "+publicationsperYear[year][pub]["address"]+", "+numberToMonth[publicationsperYear[year][pub]["month"]]+" "+year+".</i>&nbsp;"
            toadd+="<span class=\"note\"></span><span class=\"bibbase_note\"></span><br class=\"publication_paper_content\"><span class=\"publication_paper_content dontprint\">"
            if("doi" in publicationsperYear[year][pub]){
                toadd+="<a href=\"http://doi.org/"+publicationsperYear[year][pub]["doi"]+"\" onclick=\"log_download('homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019', 'http://doi.org/"+publicationsperYear[year][pub]["doi"]+"', event.ctrlKey)\" class=\"bibbase bibtex link\" target=\"_blank\"><span>doi</span></a>&nbsp;"
            }
            if("bibtex" in publicationsperYear[year][pub]){
            toadd+="<a href=\"#\" onclick=\"showBib(event); return false;\" class=\"bibbase bibtex link\" style=\"\">bibtex<i class=\"fa fa-caret-down\"></i></a>&nbsp;<a class=\"bibbase_abstract_link bibbase link\" href=\"#\" onclick=\"showAbstract(event); return false;\" style=\"\">abstract <i class=\"fa fa-caret-down\"></i></a> <div class=\"well well-small bibbase\" data-type=\"bibtex\" style=\"display:none\"><pre style=\"white-space: pre-wrap;\" class=\"prettyprint\">"+publicationsperYear[year][pub]["bibtex"]+"</pre></div>"
            }
            if("abstract" in publicationsperYear[year][pub]){ 
                toadd+="<div class=\"well well-small bibbase\" data-type=\"abstract\" style=\"display:none\">"+publicationsperYear[year][pub]["abstract"]+"</div>"
            }
            toadd+="</div>"
        }
        toadd+="</div>"
  }
          document.getElementById(elementID).innerHTML = toadd    
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

function createORCIDFundingProfile(orcidID, elementID) {
var fundingPerYear={}
  var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/fundings";

  fetch(ORCIDLink,

      {
        headers: {
          "Accept": "application/orcid+json"
        }
      })
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(data) {

          ////DEBUG!

          var output = "";
          for (var i in data.group) {
            //GET PUT CODES
            var putcode = data.group[i]["funding-summary"]["0"]["put-code"];
            getFundingInformation(putcode, orcidID, elementID)
          }

          document.getElementById(elementID).innerHTML = output;
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

function createORCIDPeerReviewProfile(orcidID,elementID,fromYear,toYear){
    var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/peer-reviews";
    peerReviewsPerYear={}
    console.log("PEER REVIEW")
    console.log("https://pub.orcid.org/v2.0/" + orcidID + "/peer-reviews")
    fetch(ORCIDLink,

      {
        headers: {
          "Accept": "application/orcid+json"
        }
      })
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(data) {

          console.log("PEER REVIEW")
          ////DEBUG!
          console.log(data);

          var output = "";
          for (var i in data.group) {
            //GET PUT CODES
              var reviewyear = data.group[i]["peer-review-summary"]["0"]["completion-date"]["year"];
            if(reviewyear<fromYear && reviewyear>toYear){
                continue;
            }
            var putcode = data.group[i]["peer-review-summary"]["0"]["put-code"];
            getPeerReviewInformation(putcode, orcidID, elementID)
          }
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

function getPeerReviewInformation(putCode,orcidID,elementID){
    console.log("PEER REVIEW INFORMATION")
    var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/peer-review/"+putCode;
    fetch(ORCIDLink,

      {
        headers: {
          "Accept": "application/orcid+json"
        }
      })
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(data) {

          ////DEBUG!
          console.log(data);

          var output = "";
            var outputJSONRev={}
            //GET PUT CODES
            var putcode = data["put-code"];
            var year = data["review-completion-date"]["year"].value;
            var issn = data["review-group-id"];
            outputJSONRev["year"]=year
            outputJSONRev["issn"]=issn
            outputJSONRev["title"]=data["review-identifiers"]["external-id"][0]["external-id-value"];
            outputJSONRev["type"]=data["subject-type"];
            outputJSONRev["rtype"]=data["review-type"];
            outputJSONRev["role"]=data["reviewer-role"];
            outputJSONRev["url"]=data["review-url"].value;
            if(!(year in peerReviewsPerYear)){
                peerReviewsPerYear[year]=[]                            
            }
            peerReviewsPerYear[year].push(outputJSONRev)
            console.log("PEERREVIEWPERYEAR")
            console.log(peerReviewsPerYear)
            //getPeerReviewInformation(putcode, orcidID, elementID)
        toadd=""
  years=Object.keys(peerReviewsPerYear).sort().reverse()
  for(yearr in years){
        year=years[yearr]
        console.log(year)
        toadd+="<div class=\"publication_group_whole\" id=\"group_"+year+"\">"
        toadd+="<div class=\"publication_group\" onclick=\"toggleGroup('group_"+year+"')\" onkeypress=\"toggleGroup('group_"+year+"')\" tabindex=\"0\"><i class=\"fa fa-angle-down publication_group_head_icon\"></i>&nbsp;"
        console.log(peerReviewsPerYear[year])
        toadd+="<span>"+year+"</span>&nbsp;<span class=\"publication_group_count\">("+peerReviewsPerYear[year].length+")</span></div>"
        for(pub in peerReviewsPerYear[year]){
            toadd+="<div class=\"publication_paper\" id=\"homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019\"><span class=\"publication_paper_titleauthoryear\">"
            toadd+=peerReviewsPerYear[year][pub]["rtype"]+"&nbsp;<span class=\"publication_paper_title\"><a href=\""+peerReviewsPerYear[year][pub]["url"]+"\" onclick=\"return trackOutboundLink('publications', 'click', 'homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019', '//bibbase.org/network/publication/homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019');\">"
            toadd+="<b>"+peerReviewsPerYear[year][pub]["title"]+"</b></a></span>&nbsp;<span class=\"publication_paper_author\">As: "+peerReviewsPerYear[year][pub]["role"]+"</span>&nbsp;</span>In: <i><a href=\"https://portal.issn.org/resource/ISSN/"+peerReviewsPerYear[year][pub]["issn"].replace("issn:","")+"\">"+peerReviewsPerYear[year][pub]["issn"]+"</a></i>&nbsp;Of: "+peerReviewsPerYear[year][pub]["type"]
            toadd+="<span class=\"note\"></span><span class=\"bibbase_note\"></span><br class=\"publication_paper_content\"><span class=\"publication_paper_content dontprint\">"
            toadd+="</div>"
        }
        toadd+="</div>"
  }
          document.getElementById(elementID).innerHTML = toadd  

        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
    
}

function getFundingInformation(putcode, orcidID, elementID) {
  var ORCIDLink = "https://pub.orcid.org/v2.0/" + orcidID + "/funding/" + putcode;

  fetch(ORCIDLink,

      {
        headers: {
          "Accept": "application/orcid+json"
        }
      })
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json().then(function(data) {

          ////DEBUG!
          console.log(data);
          outputFundingJSON={}
          if (data["title"] != null) {
            var fundingTitle = data["title"]["title"].value;
            outputFundingJSON["title"]=fundingTitle;
          } else {
            var fundingTitle = "";
          }

          if (data["organization-defined-type"]!=null && data["organization-defined-type"].value != null) {
            var fundingType = data["organization-defined-type"].value;
            outputFundingJSON["type"]=fundingType;
        } else {
            var fundingType = "";
          }

          if (data["organization"]["name"] != null) {
            var fundingBody = data["organization"]["name"];
            outputFundingJSON["organization"]=fundingBody;
          } else {
            var fundingBody = "";
          }

          if (data["start-date"]["year"] != null) {
            var startDate = data["start-date"]["year"].value;
            outputFundingJSON["year"]=startDate
          } else {
            var startDate = "";
          }

        if (data["start-date"] != null) {
            outputFundingJSON["fromDate"]=data["start-date"]["month"].value+"-"+data["start-date"]["year"].value
          }

        if (data["end-date"] != null) {
            outputFundingJSON["toDate"]=data["end-date"]["month"].value+"-"+data["end-date"]["year"].value
          }
          
        if (data["type"] != null) {
            var type = data["type"];
            outputFundingJSON["type"]=type
          } else {
            var startDate = "";
          }
          
          if(!(startDate in fundingPerYear)){
            fundingPerYear[startDate]=[]       
          }
          fundingPerYear[startDate].push(outputFundingJSON)
              toadd=""
        years=Object.keys(fundingPerYear).sort().reverse()
        for(yearr in years){
            year=years[yearr]
            console.log(year)
        toadd+="<div class=\"publication_group_whole\" id=\"group_"+year+"\">"
        toadd+="<div class=\"publication_group\" onclick=\"toggleGroup('group_"+year+"')\" onkeypress=\"toggleGroup('group_"+year+"')\" tabindex=\"0\"><i class=\"fa fa-angle-down publication_group_head_icon\"></i>&nbsp;"
        console.log(fundingPerYear[year])
        toadd+="<span>"+year+"</span>&nbsp;<span class=\"publication_group_count\">("+fundingPerYear[year].length+")</span></div>"
        for(pub in fundingPerYear[year]){
            toadd+="<div class=\"publication_paper\" id=\"homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019\"><span class=\"publication_paper_titleauthoryear\">"
            toadd+=fundingPerYear[year][pub]["type"]+"&nbsp;<span class=\"publication_paper_title\"><a href=\"http://doi.org/"+fundingPerYear[year][pub]["doi"]+"\" onclick=\"return trackOutboundLink('publications', 'click', 'homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019', '//bibbase.org/network/publication/homburg-bhm-bruhn-hubrich-evaluatinglinkeddatalocationbasedservicesusingtheexampleofstolpersteine-2019');\">"
            toadd+="<b>"+fundingPerYear[year][pub]["title"]+"</b></a></span>&nbsp;<span class=\"publication_paper_author\">Awarded By: "+fundingPerYear[year][pub]["organization"]+"</span>&nbsp;</span>"
            toadd+="From: "+fundingPerYear[year][pub]["fromDate"]+" To: "+fundingPerYear[year][pub]["toDate"]
            toadd+="<span class=\"note\"></span><span class=\"bibbase_note\"></span><br class=\"publication_paper_content\"><span class=\"publication_paper_content dontprint\">"
            toadd+="</div>"
        }
        toadd+="</div>"
  }
          
          document.getElementById(elementID).innerHTML = toadd

        });

      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}

toggleGroup = function(id) {
    $("#" + id + " .publication_group_body").toggle(200);
    $("#" + id + " .publication_group_head_icon").toggleClass("fa-angle-down").toggleClass("fa-angle-right")
}

toggle = function(d) {
    console.log(d);
    $(d.nextSibling).toggle(200);
    $(d.firstChild).toggleClass("fa-angle-down").toggleClass("fa-angle-right")
}

showBib = function(e) {
    $(e.target).parents(".publication_paper").find("[data-type=bibtex]").slideToggle(300)
}
;
showAbstract = function(e) {
    $(e.target).parents(".publication_paper").find("[data-type=abstract]").slideToggle(300)
}
;
