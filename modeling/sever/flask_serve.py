import pickle
import argparse
import logging
import json
import numpy as np
from flask import Flask
try:
    from flask_restplus import Namespace, Resource, Api
except:
    import werkzeug, flask.scaffold
    werkzeug.cached_property = werkzeug.utils.cached_property
    flask.helpers._endpoint_from_view_func = flask.scaffold._endpoint_from_view_func
    from flask_restplus import Namespace, Api, Resource

from flask_restplus import reqparse
from numpy.linalg import norm
from sklearn.neighbors import NearestNeighbors
from os import listdir
from os.path import isfile, join
from collections import defaultdict

app = Flask(__name__)
api = Api(app=app)
ns_conf = api.namespace('knowledgegraph', description='methods')

parser = argparse.ArgumentParser(description='Argument Parser')
parser.add_argument('--data', type=str, default="../../data", help='Data path')
args = parser.parse_args()

id_parser = reqparse.RequestParser()
id_parser.add_argument('id', type=str, help='doc id')


def pkl_loader():
    train_dict = {}
    id_to_idx = {}
    onlyfiles = [f for f in listdir(args.data) if isfile(join(args.data, f))]
    for _, filename in enumerate(onlyfiles):
        with open(join( args.data, filename), 'rb') as f:
            train_dict = pickle.load(f)
    for idx, i in enumerate(train_dict['PubmedArticleSet']['PubmedArticle']):
        id_num = i['MedlineCitation']['PMID']['#text']
        id_to_idx[str(id_num)] = idx
    return train_dict['PubmedArticleSet']['PubmedArticle'], id_to_idx

@ns_conf.route('/id2abs')
class id2abs(Resource):
    @ns_conf.doc(parser=id_parser)
    def get(self):
        train_dict, id_to_idx = pkl_loader()
        args = id_parser.parse_args()

        try:
            # print(id_to_idx)
            idx = int(id_to_idx[args['id']])
            abs_text = train_dict[idx]['MedlineCitation']['Article']['Abstract']['AbstractText']
            if isinstance(abs_text, list):
                abs_text_str = ""
                for subtext in abs_text:
                    subtext = subtext["#text"]
                    subtext += " "
                    abs_text_str += subtext
            else:
                abs_text_str = train_dict[idx]['MedlineCitation']['Article']['Abstract']['AbstractText']
            title_text = train_dict[idx]['MedlineCitation']['Article']['ArticleTitle']

            return {
                'given': args['id'],
                'title': title_text,
                'abstract': abs_text_str
            }
        except:
            return 'ID Not Found'

@ns_conf.route('/id2author')
class id2author(Resource):
    @ns_conf.doc(parser=id_parser)
    def get(self):
        train_dict, id_to_idx = pkl_loader()
        args = id_parser.parse_args()
        try:
            idx = int(id_to_idx[args['id']])
            author_dict = train_dict[idx]['MedlineCitation']['Article']['AuthorList']['Author']
            title_text = train_dict[idx]['MedlineCitation']['Article']['ArticleTitle']
            return {
                'given': args['id'],
                'title': title_text,
                'auther_list': author_dict
            }
        except:
            return 'ID Not Found'

# @ns_conf.route('/id2author')
# class id2author(Resource):
#     @ns_conf.doc(parser=id_parser)
#     def get(self):
#         return {}


@ns_conf.route('/id2keyword')
class id2keyword(Resource):
    @ns_conf.doc(parser=id_parser)
    def get(self):
        train_dict, id_to_idx = pkl_loader()
        args = id_parser.parse_args()

        # idx = int(id_to_idx[args['id']])
        # print(id_to_idx)

        try: # 30569483 # not all of the article has a keyword list

            idx = int(id_to_idx[args['id']])

            abs_text = train_dict[idx]['MedlineCitation']['Article']['Abstract']['AbstractText']
            if isinstance(abs_text, list):
                abs_text_str = ""
                for subtext in abs_text:
                    subtext = subtext["#text"]
                    subtext += " "
                    abs_text_str += subtext
            else:
                abs_text_str = train_dict[idx]['MedlineCitation']['Article']['Abstract']['AbstractText']
            title_text = train_dict[idx]['MedlineCitation']['Article']['ArticleTitle']

            keyword_list = []

            if "KeywordList" in train_dict[idx]['MedlineCitation'].keys():
                for keyword_dict in train_dict[idx]['MedlineCitation']["KeywordList"]["Keyword"]:
                    # print(keyword_dict["#text"])
                    keyword_list.append(keyword_dict["#text"])

            print(keyword_list)

            return {
                'given': args['id'],
                'title': title_text,
                'abstract': abs_text_str,
                'keyword': keyword_list,
            }
        except:
            return 'ID Not Found'


@ns_conf.route('/id2downloadurl')
class id2downloadurl(Resource):
    @ns_conf.doc(parser=id_parser)
    def get(self):
        train_dict, id_to_idx = pkl_loader()
        args = id_parser.parse_args()

        # print(id_to_idx)
        try: # 31825506 # not all of the article has a url

            idx = int(id_to_idx[args['id']])
            title_text = train_dict[idx]['MedlineCitation']['Article']['ArticleTitle']
            # dict_all(train_dict[idx])
            # print(train_dict[idx]['PubmedData']['ArticleIdList']['ArticleId'])

            infolist = train_dict[idx]['PubmedData']['ArticleIdList']['ArticleId']
            key_buf = [x["@IdType"] for x in infolist]
            url = None

            if "pii" in key_buf:
                idx = key_buf.index("pii")
                pii_id = infolist[idx]["#text"]
                url = "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/" + pii_id

            return {
                'given': args['id'],
                'title': title_text,
                'download_url': url
            }
        except:
            return 'ID Not Found'


@ns_conf.route('/id2nihurl')
class id2nihurl(Resource):
    @ns_conf.doc(parser=id_parser)
    def get(self):
        train_dict, id_to_idx = pkl_loader()
        args = id_parser.parse_args()

        # print(id_to_idx)
        try: # 31825506 # not all of the article has a url

            idx = int(id_to_idx[args['id']])
            title_text = train_dict[idx]['MedlineCitation']['Article']['ArticleTitle']
            # dict_all(train_dict[idx])

            # print(train_dict[idx]['PubmedData']['ArticleIdList']['ArticleId'])

            infolist = train_dict[idx]['PubmedData']['ArticleIdList']['ArticleId']
            key_buf = [x["@IdType"] for x in infolist]
            url = None

            if "pmc" in key_buf:
                idx = key_buf.index("pmc")
                pmc_id = infolist[idx]["#text"]
                # print(pmc_id)
                url = "https://www.ncbi.nlm.nih.gov/pmc/articles/" + pmc_id + "/?report=reader"

            return {
                'given': args['id'],
                'title': title_text,
                'NIH_url': url
            }
        except:
            return 'ID Not Found'

def dict_all(data):
    if isinstance(data, dict):
        for k, v in data.items():
            print(k, end=" -> ")
            dict_all(v)

            # if k == "ISSNLinking":
            #     print(v)
            # else:
            #     dict_all(v)

    elif isinstance(data, (list, tuple, set)):
        for v in data:
            dict_all(v)
    else:
        if data is not None and "suzuki_2019_oi_190654.pdf" in data:  # "2757375" in data:
            print(data)
            print("")


        # for idx in range(len(id_to_idx)):
        #     keyword_list = []
        #     # print(train_dict[idx]["PubmedData"]["PublicationStatus"])
        #     # print(train_dict[idx]['MedlineCitation'].keys())
        #     # print(train_dict[idx]['MedlineCitation']["Article"].keys())
        #
        #     title_text = train_dict[idx]['MedlineCitation']['Article']['ArticleTitle']
        #     # print(title_text)
        #
        #     # if "ISSN" in train_dict[idx]['MedlineCitation']["Article"]["Journal"].keys():
        #     #     print(train_dict[idx]['MedlineCitation']["Article"]["Journal"]["ISSN"]["#text"])
        #     # else:
        #     #     print(None)
        #     #
        #     # if "ISSNLinking" in train_dict[idx]['MedlineCitation']["MedlineJournalInfo"].keys():
        #     # # MedlineJournalInfo -> Country -> MedlineTA -> NlmUniqueID -> ISSNLinking -> 1931 - 7557
        #     #     print(train_dict[idx]['MedlineCitation']["MedlineJournalInfo"]["ISSNLinking"])
        #     # else:
        #     #     print(None)
        #
        #     print(train_dict[idx]['PubmedData']['ArticleIdList']) # ['pmc']['#text']
        #
        #     infolist = train_dict[idx]['PubmedData']['ArticleIdList']['ArticleId']
        #
        #     key_buf = [x["@IdType"] for x in infolist]
        #     if "pmc" in key_buf:
        #         idx = key_buf.index("pmc")
        #         print(infolist[idx])
        #         pmc_id = infolist[idx]["#text"]
        #
        #
        #         print(pmc_id)
        #
        #     hegsns


# print(train_dict[idx].keys())
# print(train_dict[idx]['PubmedData'].keys())
# print(train_dict[idx]['MedlineCitation'].keys())
# print(train_dict[idx]['MedlineCitation']['@IndexingMethod'])

# for idx in range(len(id_to_idx)):
#     keyword_list = []
#
#     if "KeywordList" in train_dict[idx]['MedlineCitation'].keys():
#
#         # print(type(train_dict[idx]['MedlineCitation']["KeywordList"]["Keyword"]))
#
#         for keyword_dict in train_dict[idx]['MedlineCitation']["KeywordList"]["Keyword"]:
#             # print(keyword_dict["#text"])
#             keyword_list.append(keyword_dict["#text"])
#
#     print(keyword_list)


# for akey in list(train_dict[idx]['MedlineCitation']['Article'].keys()):
#     print(akey, train_dict[idx]['MedlineCitation']['Article'][akey])
#     print("")
#     print("")

        
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5566)
