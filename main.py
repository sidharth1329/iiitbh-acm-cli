#!/usr/bin/env python

import webapp2
import jinja2
import os

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

class MainHandler(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        template = jinja_environment.get_template('index.html')
        self.response.out.write(template.render())

class Visual(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        template = jinja_environment.get_template('visual.html')
        self.response.out.write(template.render())
        
app = webapp2.WSGIApplication([('/', MainHandler),
							   ('/visual', Visual)],debug=True)
