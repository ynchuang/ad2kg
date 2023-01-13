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
parser.add_argument('--data', type=str, help='Data path')
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
        try:
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
        idx = int(id_to_idx[args['id']])
        author_dict = train_dict[idx]['MedlineCitation']['Article']['AuthorList']['Author']
        try:
            return {
                'given': args['id'],
                'abstract': author_dict
            }
        except:
            return 'ID Not Found'

@ns_conf.route('/id2author')
class id2author(Resource):
    @ns_conf.doc(parser=id_parser)
    def get(self):
        return {}
        
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5566)
