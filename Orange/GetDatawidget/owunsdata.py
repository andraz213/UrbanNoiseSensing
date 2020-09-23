import Orange
import numpy as np
from AnyQt.QtCore import Qt, QSize
from PyQt5.QtWidgets import QListWidgetItem, QGridLayout
from orangewidget.utils.widgetpreview import WidgetPreview
from datetime import *
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
import requests
import json
from Orange.data import Table, Domain, StringVariable, ContinuousVariable, DiscreteVariable, TimeVariable
from Orange.preprocess import Impute, Continuize
from Orange.widgets import gui, settings
from Orange.widgets.widget import OWWidget, Default, Output

from AnyQt.QtGui import QIntValidator

class UNSdata(OWWidget):
    name = "UNSdata"
    description = "UNS data collection."
    icon = "icons/XXX.svg"

    class Outputs:
        data = Output("Data", Orange.data.Table)


    BASE_URL = 'https://urbannoisesensing.herokuapp.com/api/'

    number = settings.Setting(42)
    want_main_area = True
    resizing_enabled = True
    selected = []
    n_attributes = 0
    last_measurements = 100
    n_intervals = 10
    interval_len = 30
    query_type = 0

    last_seconds = 100

    query_controls = False

    lb_labels = []


    MAX_N_ATTRS = 13

    display_index = []

    def __init__(self):
        super().__init__(self)

        gui.rubber(self.controlArea)

        box = gui.vBox(self.mainArea, "Configure data query")
        grid = QGridLayout()

        self.radiobox = gui.radioButtons(box, self, "query_type", callback=self.radio_changed)

        gui.appendRadioButton(self.radiobox, "All data")
        gui.appendRadioButton(self.radiobox, "Interesting intervals")

        ibox = gui.indentedBox(self.radiobox)

        gui.spin(
            ibox, self, "interval_len", 1, 100000, label="Interval length",
            controlWidth=60, callback=self.number_changed)

        gui.spin(
            ibox, self, "n_intervals", 1, 100000, label="Number of intervals",
            controlWidth=60, callback=self.number_changed)

        gui.appendRadioButton(self.radiobox, "Custom intervals")

        gui.appendRadioButton(self.radiobox, "Last n seconds")

        nbox = gui.indentedBox(self.radiobox)

        gui.spin(
            nbox, self, "last_seconds", 1, 10000000, label="Last seconds",
            controlWidth=60, callback=self.number_changed)

        gui.appendRadioButton(self.radiobox, "Last n measurements on each sensor")

        nmbox = gui.indentedBox(self.radiobox)

        gui.spin(
            nmbox, self, "last_measurements", 1, 10000000, label="Last measurements",
            controlWidth=60, callback=self.number_changed)

        self.radiobox.setDisabled(not self.query_controls)

        self.apply_button = gui.button(self.mainArea, self, self.tr("&Apply"),
                   callback=self.apply)



        self.objects = {}
        self.lb_objects = gui.listBox(self.controlArea, self, "selected", "lb_labels", box="Deployments",
                                    callback=self.sel_changed,
                                      sizeHint=QSize(300, 300))
        self.lb_objects.setFocusPolicy(Qt.NoFocus)

        self.get_deployments()



    def get_deployments(self):
        url = self.BASE_URL + 'deployment'
        response = requests.get(url, headers={'content-type': 'application/json', 'accept': 'application/json'})
        if response.status_code == 200:
            deployments = response.json()

            for dep in deployments:
                jsn_data = dep
                item = QListWidgetItem(dep["name"])
                item.setData(Qt.UserRole, jsn_data)
                self.lb_objects.addItem(item)


    def radio_changed(self):
        print(self.query_type)


    def apply(self):
        if self.lb_objects.count() != 0:
            selected_deployment = self.lb_objects.currentItem().data(Qt.UserRole)
            dep_id = selected_deployment["_id"]
            url = self.BASE_URL

            if self.query_type == 0:
                url += 'data/deployment/'
                url += str(dep_id)

            if self.query_type == 1:
                url += 'data/deployment/interesting/'
                url += str(dep_id)
                url += '/'
                url += str(self.interval_len)
                url += '/'
                url += str(self.n_intervals)

            if self.query_type == 2:
                print("yeet")

            if self.query_type == 3:
                url += 'data/deployment/'
                url += str(dep_id)
                url += '/seconds/'
                url += str(self.last_seconds)

            if self.query_type == 4:
                url += 'data/deployment/'
                url += str(dep_id)
                url += '/'
                url += str(self.last_measurements)

            print(url)

            response = requests.get(url, headers={'content-type': 'application/json', 'accept': 'application/json'})
            if response.status_code == 200:
                recieved_data = response.json()
                print(recieved_data)
                decibels = []
                long = []
                lat = []
                timestamp = []
                ids = []
                date_time = []
                fft_data = []
                frequens = []

                for id, sensor in enumerate(recieved_data):
                    for dd in sensor["data"]:
                        decibels.append(dd["decibels"])
                        ids.append(id)
                        long.append(sensor["location"][0])
                        lat.append(sensor["location"][1])
                        timestr = str(dd["measured_at"])
                        timestr = timestr.replace("T", " ")
                        timestr = timestr.replace("Z", "")
                        print(timestr)

                        time = datetime.strptime(timestr, '%Y-%m-%d %H:%M:%S.%f')
                        print(time.timestamp())
                        print(str(time))
                        timestamp.append(time.timestamp())
                        date_time.append(str(time))
                        fft_data.append(dd["fftValues"])

                        frekvence = [(i/len(dd["fftValues"]))*dd["frequencyRange"] for i in range(len(dd["fftValues"]))]
                        frequens = frekvence

                time_var = TimeVariable()
                to_zip_td = [time_var.parse(i) for i in date_time]

                con_domena = [ContinuousVariable("decibels"), ContinuousVariable("sensor_id"), ContinuousVariable("longitude"), ContinuousVariable("lattitude"), ContinuousVariable("timestamp")]
                for ff in frequens:
                    con_domena.append(ContinuousVariable(str(ff)))

                fft_data = list(map(list, zip(*fft_data)))

                transformed_data =Table.from_list(
                    Domain(con_domena,
                        [TimeVariable('datetime')]),
                    list(zip(decibels, ids, long, lat, timestamp, *fft_data, to_zip_td))
                )

                print(transformed_data)
                self.Outputs.data.send(transformed_data)







                #output = Orange.data.Table.from_list()




    def number_changed(self):
        print("sds")
        print(self.number)
        print(self.display_index)
        if self.lb_objects.count() == 0:
            print("bleh")
        else:
            print(self.lb_objects.currentItem())


    def sel_changed(self):
        print("sds")
        print(self.number)
        if self.lb_objects.count() == 0:
            self.send("Object", None)
        else:
            self.query_controls = True
            self.radiobox.setDisabled(not self.query_controls)
            jsn_data = self.lb_objects.currentItem().data(Qt.UserRole)
            url = 'https://urbannoisesensing.herokuapp.com/api/deployment/' + str(jsn_data["_id"])
            resp = requests.get(url, headers={'content-type': 'application/json', 'accept': 'application/json'})
            print(resp.json())





if __name__ == "__main__":  # pragma: no cover
    WidgetPreview(UNSdata).run()
