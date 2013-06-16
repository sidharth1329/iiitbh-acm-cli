#!/usr/bin/env python

import webapp2
import jinja2
import os

jinja_environment = jinja2.Environment(loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))
		
class CLI(webapp2.RequestHandler):
    def get(self):
        self.response.headers['Content-Type'] = 'text/html'
        template = jinja_environment.get_template('cli.html')
        self.response.out.write(template.render())
        
app = webapp2.WSGIApplication([('/', CLI)],debug=True)
